import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  faAddressBook, faCircleUser, faEnvelope, faLocationDot, faSave, faShare,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { map } from 'lodash';
import DesignLogo from '../../assets/icons/DesignLogo';
import businessProfile from '../../assets/images/business_profile.jpg';
import useLists from '../../utils/lists';
import VCardSave from '../elements/VCardSave';

function BusinessCard() {
  const { t } = useTranslation();
  const { cta } = useLists();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: t('business_card.full_name'),
        text: t('business_card.role'),
        url: window.location.href,
      });
    }
  };

  return (
    <main className="business-card">
      <div className="header">
        <Link to="/">
          <DesignLogo />
        </Link>
        <img src={businessProfile} alt="profile" className="profile" />
        <div className="credentials">
          <h2>{t('business_card.full_name')}</h2>
          <h4>{t('business_card.role')}</h4>
        </div>
        <div className="quick-actions">
          <a className="quick-action" href={'mailto:' + t('business_card.contact.email.value')} target="_blank">
            <FontAwesomeIcon icon={faEnvelope} />
          </a>
          <a className="quick-action" href={t('business_card.location.url')} target="_blank">
            <FontAwesomeIcon icon={faLocationDot} />
          </a>
        </div>
      </div>
      <div className="content-wrapper">
        <div className="section-wrapper">
          <div className="section-label">
            <FontAwesomeIcon icon={faAddressBook} />
            <h2>{t('business_card.contact.title')}</h2>
          </div>
          <label>
            {t('business_card.contact.email.label')}
            <input defaultValue={t('business_card.contact.email.value')} readOnly />
          </label>
          <label>
            {t('business_card.contact.company')}
            <a href={t('business_card.company_url')} target="_blank">
              <input defaultValue={t('business_card.company')} readOnly />
            </a>
          </label>
        </div>
        <div className="section-wrapper">
          <div className="section-label">
            <FontAwesomeIcon icon={faCircleUser} />
            <h2>{t('business_card.summary')}</h2>
          </div>
          <span>
            {t('business_card.summary_1') + (new Date().getFullYear() - 2021) + t('business_card.summary_2')}
          </span>
        </div>
        <div className="section-wrapper">
          <div className="section-label">
            <FontAwesomeIcon icon={faLocationDot} />
            <h2>{t('business_card.location.title')}</h2>
          </div>
          <input defaultValue={t('business_card.location.address')} readOnly />
          <a href={t('business_card.location.url')} target="_blank" className="map">
            {t('business_card.location.cta')}
          </a>
        </div>
        <div className="section-wrapper call-to-actions">
          {map(cta, (action) => (
            <a
              key={action.label}
              href={action.url}
              target="_blank"
              className="call-to-action-icons"
            >
              <FontAwesomeIcon icon={action.icon} />
            </a>
          ))}
        </div>
        <div className="section-wrapper">
          <Link to="/" className="cta-website">
            {t('business_card.actions.to_website')}
          </Link>
        </div>
      </div>
      <div className="actions-wrapper">
        <FontAwesomeIcon className="share" title={t('business_card.actions.share')} icon={faShare} onClick={handleShare} />
        <VCardSave>
          <FontAwesomeIcon className="save" title={t('business_card.actions.save')} icon={faSave} />
        </VCardSave>
      </div>
    </main>
  );
}

export default BusinessCard;
