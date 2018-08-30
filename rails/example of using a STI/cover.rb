class Cover < ApplicationRecord
  belongs_to :quote, optional: true

  scope :jewelleries, -> { where(type: 'CoverJewellery') }
  scope :artworks, -> { where(type: 'CoverArtwork') }
  scope :personal_accidents, -> { where(type: 'CoverPersonalAccident') }
  scope :journey_accidents, -> { where(type: 'CoverJourneyAccident') }
  scope :voluntary_workers, -> { where(type: 'CoverVoluntaryWorker') }

  def self.types
    %w[jewellery artwork personal_accidents
       journey_accidents voluntary_workers]
  end
end
