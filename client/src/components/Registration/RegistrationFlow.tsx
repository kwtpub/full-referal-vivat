import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../main';
import { observer } from 'mobx-react-lite';
import RegistrationFormStep1 from './Steps/RegistrationFormStep1';
import RegistrationFormStep2 from './Steps/RegistrationFormStep2';
import RegistrationLoader from './Loader/RegistrationLoader';
import RegistrationSuccess from './Success/RegistrationSuccess';

type RegistrationStep = 1 | 2 | 'loading' | 'success';

const RegistrationFlow = () => {
  const navigate = useNavigate();
  const { store } = useContext(Context);
  const [step, setStep] = useState<RegistrationStep>(1);
  const [serverError, setServerError] = useState<string>('');
  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleStep1Next = (data: { firstName: string; lastName: string }) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setServerError('');
    setStep(2);
  };

  const handleStep2Back = () => {
    setServerError('');
    setStep(1);
  };

  const handleStep2Submit = async (data: { email: string; password: string }) => {
    const finalData = { ...formData, ...data };
    setFormData((prev) => ({ ...prev, ...data }));

    const username = `${finalData.firstName} ${finalData.lastName}`.trim();
    try {
      setServerError('');
      setStep('loading');
      
      await store.registration(username, finalData.email, finalData.password);
      
      setTimeout(() => {
        setStep('success');
      }, 2000);
    } catch (error) {
      setStep(2);
      const message = error instanceof Error ? error.message : 'Непредвиденная ошибка';
      setServerError(message);
    }
  };

  const handleSuccess = () => {
    // Переход на страницу логина после успешной регистрации
    navigate('/login');
  };

  if (step === 'loading') {
    return <RegistrationLoader />;
  }

  if (step === 'success') {
    return <RegistrationSuccess onStart={handleSuccess} />;
  }

  if (step === 1) {
    return (
      <RegistrationFormStep1
        onBack={() => navigate('/')}
        onNext={handleStep1Next}
        onSwitchToLogin={() => navigate('/login')}
        initialData={{ firstName: formData.firstName, lastName: formData.lastName }}
      />
    );
  }

  return (
    <RegistrationFormStep2
      onBack={handleStep2Back}
      onSubmit={handleStep2Submit}
      onSwitchToLogin={() => navigate('/login')}
      serverError={serverError}
      initialData={{
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      }}
    />
  );
};

export default observer(RegistrationFlow);

