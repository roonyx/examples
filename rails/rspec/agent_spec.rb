require 'rails_helper'

describe Agent do
  include_context :for_agents

  subject(:agent) { build :agent }

  it_behaves_like :a_paranoid_model

  it_behaves_like :a_devise_token_auth_model_with,
                  %i(database_authenticatable trackable validatable)

  it { is_expected.to have_many(:viewing_times) }

  it do
    is_expected.to enumerize(:user_type)
                     .in(:agent, :manager)
                     .with_default(:agent)
                     .with_predicates(true)
  end

  describe '.office' do
    it { is_expected.to belong_to :office }
    it { is_expected.to validate_presence_of :office_id }

    before { agent.save }

    it_behaves_like :a_dependent_destroyer, false do
      let!(:dependents) { [agent.office] }
    end
  end

  describe '.email' do
    it { is_expected.to respond_to :email }
    it { is_expected.to validate_presence_of :email }

    it_behaves_like :it_has_an_email

    describe 'email taken' do
      let!(:existing_agent) { create :agent, email: agent.email }

      it_behaves_like :a_model_with_errors,
                      email: ['already in use']

      describe 'by deleted agent' do
        before { existing_agent.destroy }

        it_behaves_like :a_model_with_errors, {}
      end
    end
  end

  describe '.password' do
    it { is_expected.to respond_to :password }
    its(:password_required?) { is_expected.to eq true }

    it { is_expected.not_to allow_value('1234567').for :password }

    it { is_expected.to allow_value('12345678').for :password }
    it { is_expected.to allow_value('aaaaaaaa').for :password }
  end

  describe '.first_name' do
    it { is_expected.to respond_to :first_name }
    it { is_expected.to validate_presence_of :first_name }
    it { is_expected.to validate_length_of(:first_name).is_at_most 200 }
  end

  describe '.last_name' do
    it { is_expected.to respond_to :last_name }
    it { is_expected.to validate_presence_of :last_name }
    it { is_expected.to validate_length_of(:last_name).is_at_most 200 }
  end

  describe '.phone' do
    it { is_expected.to respond_to :phone }
    it { is_expected.to validate_presence_of :phone }

    it_behaves_like :it_has_a_phone
  end

  describe '.avatar_md5' do
    it { is_expected.to respond_to :avatar_md5 }
  end

  describe '#active_listings' do
    it { is_expected.to respond_to :active_listings }

    before { agent.save }

    let(:property_1) { create :property, office: agent.office }
    let!(:active_listing) { create :listing, property: property_1 }

    let(:property_2) { create :property, office: agent.office }
    let!(:let_listing) { create :listing, :let, property: property_2 }

    its(:active_listings) do
      is_expected.to match_array [active_listing]
    end
  end

  describe '#agent?' do
    it { is_expected.to respond_to :agent? }

    before { agent.update user_type: :agent }

    its(:agent?)   { is_expected.to eq true }
    its(:manager?) { is_expected.to eq false }
  end

  describe '#manager?' do
    it { is_expected.to respond_to :manager? }

    before { agent.update user_type: :manager }

    its(:manager?) { is_expected.to eq true }
    its(:agent?)   { is_expected.to eq false }
  end

  describe '#avatar_url' do
    it { is_expected.to respond_to :avatar_url }

    describe 'valid' do
      before { agent.save }
      its(:avatar_url) do
        is_expected.to eq "#{ENV['STORAGE_URL']}/agent/" \
          "#{agent.id}/profile/#{agent.avatar_md5}.png"
      end
    end

    describe 'missing id' do
      its(:avatar_url) { is_expected.to eq '' }
    end

    describe 'invalid avatar_md5' do
      context 'when nil' do
        before { agent.avatar_md5 = nil }
        its(:avatar_url) { is_expected.to eq '' }
      end

      context 'when incorrect length' do
        before { agent.avatar_md5 = 'f' * 10 }
        its(:avatar_url) { is_expected.to eq '' }
      end
    end
  end

  describe '#token_validation_response' do
    before { agent.save }
    its(:token_validation_response) do
      is_expected.to match_json token_validation_json_for(agent)
    end
  end

  describe '#full_name' do
    its(:full_name) do
      is_expected.to eql "#{agent.first_name} #{agent.last_name}"
    end
  end
end