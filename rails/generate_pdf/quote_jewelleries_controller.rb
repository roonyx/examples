class QuoteJewelleriesController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource param_method: :quotes_params

  def new; end

  def edit
    @quote_jewellery.insured.postcode =
      TerrorCode.find_by(
        id: @quote_jewellery.insured.terror_code_id
      ).try(:postcode)
  end

  def show
    edit
  end

  def create
    if params[:quote_jewellery][:insured_id].present?
      insured = Insured.find(params[:quote_jewellery][:insured_id])
      insured.update(insured_params[:insured_attributes]) if insured
      @quote_jewellery.insured = insured if insured
    end
    if @quote_jewellery.save
      if params['redirect'].present?
        redirect_to quote_jewellery_premium_summary_path(@quote_jewellery.id)
      else
        redirect_to root_path,
                    notice: 'Your quote has been successfully created'
      end
    else
      @has_error = true
      render 'new'
    end
  end

  def update
    @quote_jewellery.insured.postcode = params.dig(
      :quote_jewellery, :insured_attributes, :postcode
    )
    if @quote_jewellery.update(quotes_params)
      if params['redirect'].present?
        redirect_to quote_jewellery_premium_summary_path(@quote_jewellery.id)
      else
        redirect_to root_path
      end
    else
      @has_error = true
      render :edit
    end
  end

  def destroy
    @quote_jewellery.destroy
    redirect_to root_path
  end

  def premium_summary
    @quote = Quote.find(params[:quote_jewellery_id])
    if @quote.product_summaries.present?
      broker_fee = nil
      commission_rate = nil
    else
      broker_fee = @quote.broker.fee
      commission_rate = @quote.broker.commission_rate
    end
    @summary = ProductSummaryService.call(@quote,
                                          broker_fee,
                                          commission_rate)
  end

  def submit_summary
    quote = Quote.find(params[:quote_jewellery_id])
    summary = ProductSummaryService.call(quote)
    summary.each do |key, value|
      product_key = key.eql?('jewellery_artwork') ? 'jewellery' : key
      product = Product.find_by_key(product_key)
      product_summary = ProductSummary.find_or_create_by(product: product,
                                                         quote: quote)

      if product_summary.broker_fee.nil?
        product_summary.update({broker_fee: quote.broker_fee,
                                commission_rate: quote.commission_rate})
      end
      product_summary.summary_details.destroy_all
      value.each do |caption, data|
        if caption.eql?('combine')
          data.each_with_index do |detail, index|
            summary_detail = product_summary.summary_details
                                          .new(summary[key][caption][index])
            summary_detail[:caption] = "#{caption}_#{index}"
            summary_detail.save!
          end
        else
          summary_detail = product_summary.summary_details
                                          .new(summary[key][caption])
          summary_detail[:caption] = caption
          summary_detail.save!
        end
      end
    end
    quote.submit
    QuoteMailer.with(quote: quote).pdf_email.deliver_later
    redirect_to quote_acknowledgement_path(params[:quote_jewellery_id])
  end

  private

  def summary_detail product_key, caption
    params.require(:summary)
          .require(product_key)
          .require(caption)
          .permit(:base_premium,
                  :broker_fee,
                  :broker_fee_gst,
                  :calculated_premium,
                  :commission,
                  :commission_gst,
                  :net_receivable_quantum,
                  :policy_fee,
                  :policy_fee_gst,
                  :premium_gst,
                  :stamp_duty,
                  :total_payable,
                  :total_sum_insured)
  end

  def insured_params
    params.require(:quote_jewellery)
      .permit(insured_attributes: %i[name inception_date expiry_date address postcode _destroy id])
  end

  def quotes_params
    params.require(:quote_jewellery)
          .permit(:cover_jewellery_enabled,
                  :cover_artwork_enabled,
                  :insured_id,
                  cover_jewellery_attributes: %i[total_sum_insured
                                                 maximum_amount_worn
                                                 _destroy
                                                 id],
                  cover_artwork_attributes: %i[total_sum_paintings
                                               total_sum_glass
                                               _destroy
                                               id],
                  insured_attributes: %i[name inception_date expiry_date address postcode _destroy id])
          .tap do |quote|
      quote[:broker] = current_user
      if quote[:insured_id].present?
        quote.delete :insured_attributes
      else
        quote.delete :insured_id
      end
      quote[:cover_jewellery_attributes].each do |attr|
        if attr.last.include?('$')
          quote[:cover_jewellery_attributes][attr.first] = attr.last.delete(',').delete('$')
        end
      end

      quote[:cover_artwork_attributes].each do |attr|
        if attr.last.include?('$')
          quote[:cover_artwork_attributes][attr.first] = attr.last.delete(',').delete('$')
        end
      end
    end
  end
end
