/* eslint-disable no-alert */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable react/button-has-type */
/* eslint-disable react/require-default-props */
/* eslint-disable react/function-component-definition */
import './App.less';

import classNames from 'classnames';
import * as React from 'react';

import { RegForm } from '../models';

type Lang = 'Hebrew' | 'English';

const FORM_INITIAL_VALUE: RegForm = {
  name: '',
  year: '',
  phone: '0',
  email: '',
  date: '',
  time: '',
  host: false,
};

const MyInput: React.FC<{
  title: string;
  className: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  checkBoxProps?: {
    isChecked?: boolean;
  }
  description?: string;
  placeHolder?: string
}> = ({
  title, className, onChange, placeHolder, description, checkBoxProps,
}) => (
    <div className={className}>
      <div className="title-desc">

        <div className="title">{title}</div>
        <div className="desc">{description || ''}</div>
      </div>
      {!checkBoxProps
        ? (
          <div className="answer">
            <input
              onChange={onChange}
              placeholder={placeHolder || ''}
              type="string"
            />
          </div>
        )

        : <div className="answer"><input onChange={onChange} type="checkbox" checked={checkBoxProps?.isChecked} /></div>}
    </div>
  );

function getTime(): string {
  const date = new Date();
  return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function getDate(): string {
  const date = new Date();
  const year: number = date.getFullYear();
  const month: number = date.getMonth() + 1;
  const day: number = date.getDate();
  return `${day}/${month}/${year}`;
}

const FormView: React.FC<{ onChange: () => void }> = ({ onChange }) => {
  React.useEffect(() => {
    resetForm();
  }, [])

  function resetForm(): void {
    formRef.current = { ...FORM_INITIAL_VALUE };
  }

  const handleName = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const v = event.target.value;
    formRef.current.name = v;
  };
  const handleYear = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const v = event.target.value;
    formRef.current.year = v;
  };

  const handlePhone = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const v = event.target.value;
    formRef.current.phone = v;
  };
  const handleEmail = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const v = event.target.value;
    formRef.current.email = v;
  };

  const handleHost = (_: React.ChangeEvent<HTMLInputElement>): void => {
    setIsHost(!isHost);
  };

  const exportfromMain = async (): Promise<void> => {
    await window.ipcAPI?.exportToCSV(formRef.current);
  };
  const [formLang, setFormLang] = React.useState<Lang>('Hebrew');

  const isHeb = (): boolean => (formLang === 'Hebrew');
  const yearTitleHeb = 'שנה';
  const yearDescHeb = 'השנה בה השתתפת לאחרונה בקורס ויפאסנה כפי שמלמד ס.נ. גואנקה, אם לא השתתפת בקורס, אנא צור/צרי קשר עם המארח/ת לפני תחילת הישיבה';
  const yearTitleEng = 'Year of last Vipassana course as taught by S.N. Goenka, If you have not participated in a course, please contact the host before the sitting';
  const phoneTitleHeb = 'טלפון';
  const phoneDescHeb = 'לא חובה, נא להזין אם השתנה';
  const phoneTitleEng = 'Phone Number - not required, please fill if changed';
  const emailTitleHeb = 'כתובת דוא"ל';
  const emailDescHeb = 'לא חובה, נא להזין אם השתנה';
  const emailTitleEng = 'Email Address - not required, please fill if changed';
  const formRef = React.useRef<RegForm>(FORM_INITIAL_VALUE);

  const submit = async (): Promise<void> => {
    formRef.current.date = getDate();
    formRef.current.time = getTime();
    if (isHost) {
      formRef.current.host = true;
    }
    await exportfromMain();
  };

  const validate = (): boolean => formRef.current.name.length > 0;

  const switchLang = (): void => {
    setFormLang(getNextLang());
  };

  const getNextLang = (): Lang => (isHeb() ? 'English' : 'Hebrew');

  const hebPlaceHolder = 'הקלד.י את תשובתך';
  const [isHost, setIsHost] = React.useState<boolean>(false);
  return (
    <div className="form">
      <div className="lang">
        <button
          onClick={switchLang}
        >
          {`Switch to ${getNextLang()}`}
        </button>
      </div>
      <div className="header">
        {isHeb()
          ? <span className="welcome-heb">רישום לישיבה קבוצתית</span>

          : <span className="welcome-eng">Group Siting Registration</span>}
      </div>
      <div className={classNames('input-wrap', { heb: isHeb() })}>
        {isHeb()
          ? (
            <>
              <MyInput title="שם מלא" className="q-row name" onChange={handleName} placeHolder={hebPlaceHolder} />
              <MyInput title={yearTitleHeb} description={yearDescHeb} className="q-row year" onChange={handleYear} placeHolder={hebPlaceHolder} />
              <MyInput title={phoneTitleHeb} description={phoneDescHeb} className="q-row phone" onChange={handlePhone} placeHolder={hebPlaceHolder} />
              <MyInput title={emailTitleHeb} description={emailDescHeb} className="q-row email" onChange={handleEmail} placeHolder={hebPlaceHolder} />
              <MyInput
                title="מארח.ת"
                description="סמנ.י כאן אם את.ה המארח.ה"
                className="q-row host"
                onChange={handleHost}
                checkBoxProps={{ isChecked: isHost }}
              />
            </>
          )
          : (
            <>
              <MyInput title="Full Name" className="q-row name" onChange={handleName} />
              <MyInput title={yearTitleEng} className="q-row year" onChange={handleYear} />
              <MyInput title={phoneTitleEng} className="q-row phone" onChange={handlePhone} />
              <MyInput title={emailTitleEng} className="q-row email" onChange={handleEmail} />
              <MyInput
                title="Host"
                description={"Check the box if you're the host"}
                className="q-row host"
                onChange={handleHost}
                checkBoxProps={{ isChecked: isHost }}
              />
            </>
          )}
      </div>
      <div className="submit">
        <button
          className="submit-btn"
          onClick={async () => {
            if (validate()) {
              await submit();
              onChange();
            } else {
              alert('Name field cannot be empty');
            }
          }}
        >
          {' '}
          {isHeb() ? 'שליחה' : 'Submit'}
        </button>
      </div>
    </div>
  );
};

const ThankYouView: React.FC<{ onChange: () => void }> = ({ onChange }) => {
  React.useEffect(() => {
    setTimeout(onChange, 2500);
  }, [onChange]);

  return (
    <div className='thankyou-view'>
      <div className="thank-you">
        <div>Thank you for joining the Group Sitting</div>
        <br />
      </div>
      <div className="start-again">
        <br />
        <button onClick={onChange}>Register Again</button>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [state, setState] = React.useState<{ showForm: boolean }>({ showForm: true });

  const resetView = (): void => {
    setState({ showForm: true });
  };

  const showThankyouPage = (): void => {
    setState({ showForm: false });
  };

  return state.showForm
    ? <FormView onChange={showThankyouPage} />
    : <ThankYouView onChange={resetView} />;
};

export default App;
