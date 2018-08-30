class QuotesController < ApplicationController
  require 'zip'
  before_action :authenticate_user!
  load_and_authorize_resource except: :type_selection
  skip_authorization_check only: :type_selection

  def new
    if QuoteTypes::ALL.include? params[:type]
      redirect_to controller: "quote_#{params[:type].pluralize}", action: 'new'
    else
      render :type_selection
    end
  end

  def edit
    redirect_to controller: @quote.type.pluralize.underscore, action: 'edit'
  end

  def show
    redirect_to controller: @quote.type.pluralize.underscore, action: 'show'
  end

  def type_selection; end

  def acknowledgement
    @quote = Quote.find(params[:quote_id])
    @summary = {}
    product_summaries =
      @quote.product_summaries.includes(:summary_details, :product)
    product_summaries.each do |product_summary|
      product_summary.summary_details.order(total_payable: :asc).each do |summary_detail|
        key = product_summary.product.key
        product_key = key.eql?('jewellery') ? 'jewellery_artwork'.to_sym : key.to_sym

        if summary_detail.caption.include?('combine')
          @summary[product_key] = {} if !@summary[product_key].present?
          @summary[product_key]['combine'] = [] unless @summary[product_key]['combine'].present?
          @summary[product_key]['combine'] << summary_detail
        else
          @summary[product_key] = {} if !@summary[product_key].present?
          @summary[product_key][summary_detail.caption.to_sym] = summary_detail
        end
      end
    end
  end

  def get_calculated
    quote = Quote.find(params[:quote_id])
    if params[:product].eql?('jewellery_artwork')
      product = Product.find_by_key('jewellery')
    else
      product = Product.find_by_key(params[:product])
    end
    product_summary = ProductSummary.find_or_create_by(product: product,
                                                       quote: quote)
    product_summary.update({ broker_fee: params[:broker_fee].to_f,
                             commission_rate: params[:commission_rate].to_f})
    @summary = ProductSummaryService.call(Quote.find(params[:quote_id]),
                                          params[:broker_fee].to_f,
                                          params[:commission_rate].to_f)
    render json: @summary[params[:product]]
  end

  def destroy
    Quote.find(params[:id]).destroy
    redirect_to root_path
  end

  def send_email
    redirect_to root_path, notice: 'Email has been sent.' if
      QuoteMailer.with(quote: @quote).pdf_email.deliver_later
  end

  def download
    pdfs = []
    attachments = []
    zipname = "#{sprintf('QBP-%03d', @quote.id)}.zip"
    if @quote.type.eql?('QuoteJewellery') && @quote.covers.count == 2
      product = OpenStruct.new(
        key: 'private_collections',
        umr: Product.find_by(key: 'jewellery').umr,
        title: 'PrivateCollection'
      )
      generate_for(product, pdfs)
    else
      @quote.products.each do |product|
        next if QuoteData::AVAILABLE.exclude?(product.key)
        generate_for(product, pdfs)
      end
      @quote.covers.each do |cover|
        product = Product.find_by(abbreviation: cover.abbreviation)
        next if QuoteData::AVAILABLE.exclude?(product.key) ||
                @quote.products.include?(product)
        generate_for(product, pdfs)
      end
    end

    stream = Zip::OutputStream.write_buffer do |zip|
      pdfs.each do |pdf|
        zip.put_next_entry pdf[:title]
        zip.print pdf[:file]
      end
    end
    stream.rewind
    send_data stream.read, filename: zipname
  end

  private

  def generate_for(product, pdfs)
    pdfs << {
      title:
        "BrokerQuote_#{product.title}_#{sprintf('QBP-%03d', @quote.id)}.pdf",
      file: broker_pdf(product)
    }
    pdfs << {
      title:
        "ClientQuote_#{product.title}_#{sprintf('QBP-%03d', @quote.id)}.pdf",
      file: client_pdf(product)
    }
  end

  def client_pdf(product)
    @quote.product = product

    footer_html = render_to_string('shared/pdf/footer.html.erb', layout: false)
    body_html = render_to_string('shared/pdf/client_quote', layout: false)
    header_html = render_to_string('shared/pdf/header.html.erb', layout: false)

    WickedPdf.new.pdf_from_string(
      body_html,
      margin: {
        top: '45mm',
        left: '17mm',
        right: '17mm',
        bottom: '30mm'
      },
      lowquality: true,
      header: { content: header_html },
      footer: { content: footer_html }
    )
  end

  def broker_pdf(product)
    @quote.product = product

    footer_html = render_to_string('shared/pdf/footer.html.erb', layout: false)
    body_html = render_to_string(
      'shared/pdf/broker_quote.html.erb', layout: false
    )
    header_html = render_to_string('shared/pdf/header.html.erb', layout: false)

    WickedPdf.new.pdf_from_string(
      body_html,
      margin: {
        top: '45mm',
        left: '17mm',
        right: '17mm',
        bottom: '30mm'
      },
      lowquality: true,
      header: { content: header_html },
      footer: { content: footer_html }
    )
  end

  def quotes_params
    params.require(:quote).permit(
      :cover_jewellery_enabled,
      cover_jewellery_attributes: [
        :total_sum_insured, :maximum_amount_worn, :enable
      ],
      cover_artwork_attributes: %i[total_sum_paintings total_sum_glass enable],
      insured_attributes: %i[name inception_date expiry_date address]
    ).tap do |quote|
      quote[:broker] = current_user
    end
  end

  def summary_params
    params.permit(:quote_id, :broker_fee, :commission_rate, :product)
  end
end
