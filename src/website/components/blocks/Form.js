// @flow
import React, { useEffect, useState } from 'react';
import type { Node } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import {
  get, includes, isEmpty, merge,
} from 'lodash';
import classNames from 'classnames';
import ReCaptchaWrapper from '../elements/ReCaptchaWrapper';
import Waves from '../../assets/svg-components/Waves';
import Arrow from '../../assets/svg-components/Arrow';
import useLocale from '../../locale';
import { useEnvironmentInfo, useLocationInfo } from '../../utils';
import { actions } from '../../store/globalStore';

type Props = {
  close: Function,
};

function Form(props: Props): Node {
  const { t } = useLocale();
  const dispatch = useDispatch();
  const locationInfo = useLocationInfo();
  const formSubmitted = useSelector((state) => state.global.formSubmitted);
  const environment = useEnvironmentInfo();
  const [captcha, setCaptcha] = useState(null);
  const [form, setForm] = useState({
    job_type: locationInfo.isDesign
      ? t('form.job_type.options.design')
      : t('form.job_type.options.music'),
  });
  const [sendStatus, setSendStatus] = useState(null);
  const [closeDelay, setCloseDelay] = useState(null);

  let sendMessage = '';
  if (sendStatus === 'PENDING') {
    sendMessage = t('form.send_message.pending');
  }
  if (sendStatus === 'REJECTED') {
    sendMessage = t('form.send_message.rejected');
  }
  if (sendStatus === 'FULFILLED') {
    sendMessage = t('form.send_message.fulfilled');
  }

  useEffect(() => {
    if (formSubmitted) {
      setSendStatus(formSubmitted);
      if (formSubmitted === 'FULFILLED') {
        dispatch(actions.clearFormStatus());
        setCloseDelay(
          setTimeout(() => {
            setSendStatus(null);
            // props.close();
          }, 3000),
        );
      }
    }

    return () => clearTimeout(closeDelay);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formSubmitted]);

  const handleFormInput = (origin: string, val: string) => {
    setForm(merge({}, form, { [origin]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      sendStatus === 'PENDING'
      || isEmpty(get(form, 'name'))
      || isEmpty(get(form, 'email'))
      || isEmpty(get(form, 'details'))
      || (environment.isProduction && isEmpty(captcha))
    ) {
      return;
    }

    setSendStatus('PENDING');
    dispatch(actions.sendForm(form));
  };

  const formInputs = [
    {
      label: t('form.name.label'),
      placeholder: t('form.name.placeholder'),
      id: 'name',
      autocomplete: 'name',
      type: 'text',
      required: true,
    },
    {
      label: t('form.email.label'),
      placeholder: t('form.email.placeholder'),
      id: 'email',
      autocomplete: 'email',
      type: 'text',
      required: true,
    },
    {
      label: t('form.job_type.label'),
      placeholder: t('form.job_type.placeholder'),
      id: 'job_type',
      autocomplete: '',
      type: 'select',
      required: true,
    },
    {
      label: t('form.details.label'),
      placeholder: t('form.details.placeholder'),
      id: 'details',
      autocomplete: '',
      type: 'textarea',
      required: true,
    },
    {
      label: t('form.references.label'),
      placeholder: t('form.references.placeholder'),
      id: 'references',
      autocomplete: '',
      type: 'text',
      required: false,
    },
    {
      label: t('form.budget.label'),
      placeholder: t('form.budget.placeholder'),
      id: 'budget',
      autocomplete: '',
      type: 'text',
      required: false,
    },
    {
      label: t('form.deadline.label'),
      placeholder: t('form.deadline.placeholder'),
      id: 'deadline',
      autocomplete: '',
      type: 'date',
      required: false,
    },
  ];

  return (
    <ReCaptchaWrapper onVerify={(token) => setCaptcha(token)}>
      <form onSubmit={handleSubmit} className="form-wrapper">
        {sendStatus && <span className="form-notification">{sendMessage}</span>}
        <Waves className="form-graphic" />
        <FontAwesomeIcon
          className="close"
          icon={faTimes}
          onClick={() => props.close()}
        />
        <h1>{t('form.tagline')}</h1>
        <div className="form">
          {formInputs.map((input) => (
            <label key={input.id} htmlFor={input.id}>
              <span className="form-label">
                {input.required && <span className="reqired">*</span>}
                {input.label}:
              </span>
              {input.type === 'textarea' && (
                <textarea
                  id={input.id}
                  className={classNames('form-input', {
                    empty: isEmpty(get(form, input.id, '')),
                  })}
                  type={input.type}
                  name={input.id}
                  required={input.required}
                  placeholder={input.placeholder}
                  value={get(form, input.id, '')}
                  onChange={(e) => handleFormInput(input.id, e.target.value)}
                />
              )}
              {input.type === 'select' && (
                <div className="select-wrapper">
                  <select
                    id={input.id}
                    className={classNames('form-input', {
                      empty: isEmpty(get(form, input.id, '')),
                    })}
                    type={input.type}
                    name={input.id}
                    required={input.required}
                    placeholder={input.placeholder}
                    value={get(form, input.id, '')}
                    onChange={(e) => handleFormInput(input.id, e.target.value)}
                  >
                    <option>{t('form.job_type.options.design')}</option>
                    <option>{t('form.job_type.options.music')}</option>
                  </select>
                  <Arrow />
                </div>
              )}
              {includes(['text', 'date'], input.type) && (
                <input
                  id={input.id}
                  className={classNames('form-input', {
                    empty: isEmpty(get(form, input.id, '')),
                  })}
                  type={input.type}
                  name={input.id}
                  required={input.required}
                  placeholder={input.placeholder}
                  autoComplete={input.autocomplete}
                  value={get(form, input.id, '')}
                  onChange={(e) => handleFormInput(input.id, e.target.value)}
                />
              )}
            </label>
          ))}
        </div>
        <div className="actions">
          <span
            className="reset"
            onClick={() => setForm({
              job_type: locationInfo.isDesign
                ? t('form.job_type.options.design')
                : t('form.job_type.options.music'),
            })
            }
          >
            {t('form.actions.reset')}
          </span>
          <input
            type="submit"
            className="submit"
            value={t('form.actions.submit')}
          />
        </div>
      </form>
    </ReCaptchaWrapper>
  );
}

export default Form;
