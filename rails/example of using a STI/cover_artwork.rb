class CoverArtwork < Cover
  validates :total_sum_paintings, allow_nil: true, numericality: {
              less_than: 500_001,
              greater_than_or_equal_to: 0,
              message: "Can't be more than $500,000."
            }
  validates :total_sum_glass, allow_nil: true, numericality: {
              less_than: 500_001,
              greater_than_or_equal_to: 0,
              message: "Can't be more than $500,000."
            }

  def abbreviation
    'ART'
  end
end
