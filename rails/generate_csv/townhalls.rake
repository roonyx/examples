desc "Generate CSV file from xml pieces"
task generate_townhalls_csv: :environment do
  data = [
    %w[name address phone fax email website latitude longitude]
  ]
  Dir.glob(File.join(Rails.root, 'tmp', 'organismes', '**', '*.xml')).each do |file|
    next unless file.match('mairie')
    doc = File.open(file) { |f| Nokogiri::XML(f) }
    data << [
      doc.css('Nom').text,
      [doc.css('Adresse Ligne').map(&:text).join(' '),
       doc.css('Adresse CodePostal').text,
       doc.css('Adresse NomCommune').text].join(' '),
      doc.css('CoordonnéesNum Téléphone').text,
      doc.css('CoordonnéesNum Télécopie').text,
      doc.css('CoordonnéesNum Email').text,
      doc.css('CoordonnéesNum Url').text,
      doc.css('Adresse Localisation Latitude').text,
      doc.css('Adresse Localisation Longitude').text
    ]
  end
  CSV.open(File.join(Rails.root, 'db', 'assets', 'townhalls.csv'), "w") do |csv|
    data.each { |row| csv << row }
  end
end

desc 'Import townhalls list from a CSV file'
task import_townhalls: :environment do
  csv = CSV.read(File.join(Rails.root, 'db', 'assets', 'townhalls.csv'))
  head = csv.shift
  csv.each do |row|

    name = row[head.find_index('name')]
    address = row[head.find_index('address')]
    phone = row[head.find_index('phone')]
    fax = row[head.find_index('fax')]
    email = row[head.find_index('email')]
    website = row[head.find_index('website')]
    latitude = row[head.find_index('latitude')]
    longitude = row[head.find_index('longitude')]

    Townhall.create!(name: name, address: address, phone: phone, fax: fax,
                     email: email, website: website, latitude: latitude,
                     longitude: longitude)
  end
end