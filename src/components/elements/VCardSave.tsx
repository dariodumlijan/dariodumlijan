import React from 'react';
import { useTranslation } from 'react-i18next';
import FileSaver from 'file-saver';

type Props = {
  children: any,
};

function VCardSave(props: Props) {
  const { t } = useTranslation();

  const handleSaveVCARD = (e) => {
    e.preventDefault();
    const file = new Blob(
      [`BEGIN:VCARD
VERSION:3.0
N:${t('business_card.last_name')};${t('business_card.first_name')};;;
FN:${t('business_card.full_name')}
TITLE:${t('business_card.design.role')};
ORG:${t('business_card.design.company')};
ADR;type=WORK;type=pref:;;;${t('business_card.location.address')};;;
EMAIL;type=INTERNET;type=HOME;type=pref:${t('business_card.contact.email.value')}
END:VCARD`,
      ],
      { type: 'text/vcard;charset=utf-8' },
    );

    const a = document.createElement('a');
    a.download = `${t('business_card.full_name')}.vcf`;
    a.href = URL.createObjectURL(file);

    const reader = new FileReader();
    if (navigator.userAgent.match('CriOS')) {
      reader.onloadend = () => {
        window.open(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else if (navigator.userAgent.match(/iPad|iPhone|Android/i)) {
      reader.onload = () => {
        window.location.href = reader.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      FileSaver.saveAs(
        file,
        `${t('business_card.first_name')}${t('business_card.last_name')}.vcf`,
        true,
      );
    }
  };

  return (
    React.cloneElement(props.children, {
      ...props.children.props,
      onClick: handleSaveVCARD,
    })
  );
}

export default VCardSave;
