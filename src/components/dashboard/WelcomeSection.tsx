
import React from 'react';

interface WelcomeSectionProps {
  userName: string;
}

const WelcomeSection = ({ userName }: WelcomeSectionProps) => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">
        Bem-vindo{userName !== 'Usuário' ? `, ${userName}` : '!'}
      </h1>
      <p className="text-gray-600 mt-1">
        Aqui está seu progresso mais recente
      </p>
    </div>
  );
};

export default WelcomeSection;
