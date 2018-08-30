class QuoteFinancialsController < ApplicationController
  before_action :authenticate_user!
  load_and_authorize_resource param_method: :quotes_params

  def new
    @products = []
  end

  def edit
    occupation_id = @quote_financial.insured.occupation_id
    terror_code =
      TerrorCode.find(@quote_financial.insured.terror_code_id)
    @quote_financial.insured.postcode = terror_code.try(:postcode)
    @products = if occupation_id.present? && terror_code.present?
      if terror_code.location.eql?('Above 26')
        Occupation.find(occupation_id)
                  .products.financial
                  .where
                  .not(key: 'property')
      else
        Occupation.find(occupation_id).products.financial
      end
    else
      []
    end
  end

  def show
    edit
  end

  def create
    if params[:quote_financial][:insured_id].present?
      insured = Insured.find_by(id: params[:quote_financial][:insured_id])
      insured.update(insured_params[:insured_attributes]) if insured
      @quote_financial.insured = insured if insured
    end
    if @quote_financial.save
      if params['redirect'].present?
        redirect_to quote_financial_premium_summary_path(@quote_financial.id)
      else
        redirect_to root_path,
                    notice: 'Your quote has been successfully created'
      end
    else
      occupation_id =
        params[:quote_financial][:insured_attributes][:occupation_id] ||
        insured.try(:occupation_id)
      terror_code_id =
        params[:quote_financial][:insured_attributes][:terror_code_id] ||
        insured.try(:terror_code_id)
      @products = if occupation_id.present? && terror_code_id
        terror_code = TerrorCode.find(terror_code_id)
        if terror_code.location.eql?('Above 26')
          Occupation.find(occupation_id)
                    .products.financial
                    .where
                    .not(key: 'property')
        else
          Occupation.find(occupation_id).products.financial
        end
      else
        []
      end
      @has_error = true
      render 'new'
    end
  end

  def update
    @quote_financial.product_summaries.destroy_all
    @quote_financial.insured.postcode = params.dig(
      :quote_financial, :insured_attributes, :postcode
    )
    if @quote_financial.update(quotes_params)
      if params['redirect'].present?
        redirect_to quote_financial_premium_summary_path(@quote_financial.id)
      else
        redirect_to root_path, notice: 'Your quote has been successfully updated'
      end
    else
      occupation_id = params[:quote_financial][:insured_attributes][:occupation_id] ||
                      insured.try(:occupation_id)
      @products = if occupation_id.present?
        Occupation.find(occupation_id).products.financial
      else
        []
      end
      @has_error = true
      render :edit
    end
  end

  def premium_summary
    @quote = Quote.find(params[:quote_financial_id])
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
    quote = Quote.find(params[:quote_financial_id])
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
    redirect_to quote_acknowledgement_path(params[:quote_financial_id])
  end

  def destroy
    @quote_financial.destroy
    redirect_to root_path
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

  def quotes_params
    params.require(:quote_financial)
          .permit(:insured_id,
                  cover_personal_accident_attributes: %i[weekly_accident
                                                         capital_benefits
                                                         weekly_sickness
                                                         insured_1_dob
                                                         insured_1_name
                                                         insured_2_dob
                                                         insured_2_name
                                                         insured_3_dob
                                                         insured_3_name
                                                         insured_4_dob
                                                         insured_4_name
                                                         insured_5_dob
                                                         insured_5_name
                                                         _destroy
                                                         id],
                  cover_journey_accident_attributes: %i[weekly_accident
                                                        capital_benefits
                                                        _destroy
                                                        id],
                  product_info_attributes: [:professional_indemnity_policy,
                                            :malpractice_indemnity_policy,
                                            :glass, :general_property,
                                            :property_damage,
                                            :money, :theft, :year_built,
                                            product_ids: []],
                  business_info_attributes: %i[proposed_income
                                               proposed_employees vic nsw
                                               act sa nt wa tas qld foreign],
                  insured_attributes: %i[name inception_date occupation_id
                                         expiry_date address postcode _destroy id])
          .tap do |quote|
      quote[:broker] = current_user
      if quote[:insured_id].present?
        quote.delete :insured_attributes
      else
        quote.delete :insured_id
      end
      quote[:product_info_attributes].each do |attr|
        if attr.last.include?('$')
          quote[:product_info_attributes][attr.first] = attr.last.delete(',').delete('$')
        end
      end

      quote[:product_info_attributes][:year_built] =
        "01/01/#{quote[:product_info_attributes][:year_built].strip}"

      quote[:business_info_attributes].each do |attr|
        if attr.last.include?('$') || attr.last.include?('%')
          quote[:business_info_attributes][attr.first] = attr.last.delete(',').delete('$').delete('%')
        end
      end
      product_ids = quote[:product_info_attributes][:product_ids] || []
      journey_product_id = Product.find_by_key('journey').try(:id)
      if !product_ids.include?(journey_product_id.to_s)
        quote[:cover_journey_accident_attributes][:_destroy] = true
      end
      personal_product_id = Product.find_by_key('personal_accident').try(:id)
      if !product_ids.include?(personal_product_id.to_s)
        quote[:cover_personal_accident_attributes][:_destroy] = true
      end
    end
  end

  def insured_params
    params.require(:quote_financial)
          .permit(insured_attributes: %i[name inception_date occupation_id
                                         expiry_date address postcode _destroy id])
  end
end
