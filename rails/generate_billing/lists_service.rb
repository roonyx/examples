module Billing
  class ListsService
    attr_reader :user, :company, :elder, :room, :facility, :month, :year, :bill_list

    def initialize(company, params)
      @company = company
      @facility = @company.facilities.find_by(id: params[:facility_id])
      @room = Room.find_by(id: params[:room_id])
      @elder = company.elders.find_by(id: params[:elder_id])
      @month = params[:month].present? ? params[:month].try(:to_i) : nil
      @year = params[:year].present? ? params[:year].try(:to_i) : nil
      @bill_list = Billing::BillList.new(company: company, month: @month, year: @year)
    end

    def build
      return bill_list unless valid?

      build_by_elder(elder) || build_by_room(room) || build_by_facility(facility) || build_by_company
      bill_list
    end

    private

    def valid?
      return true if year.present? && month.present?

      bill_list.errors.add(:date, 'can\'t be blank')
      false
    end

    def dates
      start_date = Date.new(year, month, 1)
      end_date = Date.new(year, month, Time.days_in_month(month || 12, year))
      start_date..end_date
    end

    def current_room_fees(elder)
      room_fees = elder.room_fees
      first_fee = room_fees.order(start_date: :desc).detect { |fee| fee.start_date <= dates.first }
      query = "(start_date >= '#{dates.first.strftime('%F')}' and start_date <= '#{dates.last.strftime('%F')}')"
      query += " or id = #{first_fee.id}" if first_fee.present?
      room_fees.where(query).order(:start_date, :created_at)
    end

    def current_purchases(elder)
      elder.purchases.where(date: [dates], payment_method: :credit)
    end

    def current_additional_services(elder)
      elder.elder_additional_services
          .includes(:additional_service)
          .where("start_date <= '#{dates.last.strftime('%F')}'",
                 "end_date >= '#{dates.first.strftime('%F')}'",
                 active: true,
                 additional_services: { facility: elder.facility, active: true })
    end

    def elder_items(elder)
      items = []
      %w[purchases additional_services room_fees].each do |subject|
        items += Billing::BillsSerializer.new(send("current_#{subject}", elder), dates: dates).call
      end
      items.sort_by { |item| - item[:from].to_time.to_i }
    end

    def build_by_elder(current_elder)
      return nil if current_elder.nil?

      bill = bill_list.bills.new(elder: current_elder, room: current_elder.room)
      elder_items(current_elder).each do |params|
        bill.items << Billing::Item.new(params.merge(elder_id: current_elder.id))
      end
    end

    def build_by_room(current_room)
      return nil if current_room.nil?

      current_room.elders.each do |current_elder|
        build_by_elder(current_elder)
      end
    end

    def build_by_facility(current_facility)
      return nil if current_facility.nil?

      current_facility.elders.find_each do |current_elder|
        build_by_elder(current_elder)
      end
    end

    def build_by_company
      company.facilities.find_each do |facility|
        build_by_facility(facility)
      end
    end
  end
end