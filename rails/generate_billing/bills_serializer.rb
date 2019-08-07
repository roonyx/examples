module Billing
  class BillsSerializer
    attr_reader :list, :dates

    def initialize(list, params)
      @list = list
      @dates = params[:dates]
    end

    def call
      return send("serialize_#{list.first.class.name.pluralize.underscore}") if list.present?

      []
    end

    private

    def serialize_purchases
      items = []
      list.find_each do |purchase|
        item = { name: purchase.caption,
                 daily_rate: nil,
                 days: nil,
                 from: purchase.date,
                 to: purchase.date,
                 total_due: purchase.price }
        items << item if item[:total_due].positive?
      end
      items
    end

    def serialize_elder_additional_services
      items = []
      list.find_each do |elder_service|
        additional_service = elder_service.additional_service
        end_date = [dates.last, elder_service.end_date].min
        start_date = [dates.first, elder_service.start_date].max
        interval = (end_date - start_date).to_i + 1
        item = { name: additional_service.name,
                 daily_rate: additional_service.price,
                 days: interval,
                 from: start_date,
                 to: end_date,
                 total_due: interval * additional_service.price }
        items << item if item[:total_due].positive?
      end
      items
    end

    def serialize_room_fees
      items = []
      list.each.with_index do |room_fee, index|
        current_date = [dates.first, room_fee.start_date].max
        next_date = room_fee_next_date(index)
        interval = (next_date - current_date).to_i + 1
        day_amount = room_fee.means_tested_fee
        day_amount += room_fee.dap_amount if room_fee.deduct
        item = { name: 'Room Fee',
                 daily_rate: day_amount,
                 days: interval,
                 from: current_date,
                 to: next_date,
                 total_due: interval * day_amount }
        items << item if item[:total_due].positive?
      end
      items
    end

    def room_fee_next_date(index)
      list.count > index + 1 ? list.first(index + 2).last.start_date - 1 : dates.last
    end
  end
end