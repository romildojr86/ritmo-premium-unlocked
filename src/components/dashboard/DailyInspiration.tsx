
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const DailyInspiration = () => {
  const motivationalQuotes = [
    "Cada passo é um avanço. Siga em frente. 🚶‍♂️",
    "Seu corpo ouve tudo que sua mente diz. 🧠",
    "A vitória não está na linha de chegada, mas na persistência. 🏁",
    "Hoje é o dia ideal para fazer o que ontem você adiou. 🔥",
    "Seu único concorrente é a versão de ontem. 🪞",
    "Consistência é mais forte que motivação. Mova-se. 📈",
    "A disciplina de hoje é a liberdade de amanhã. 🕊️",
    "Você já está fazendo mais do que muitos só pensam. 🙌",
    "Quando for difícil, é porque está funcionando. 💪",
    "Pequenos passos todos os dias = grandes conquistas. 📊",
    "A meta não é ser o melhor. É não parar. 🏃‍♂️",
    "Seu corpo foi feito pra se mover. Honre isso. ⚙️",
    "Mesmo devagar, continue. A pausa não é o fim. ⏳",
    "Recompensa vem pra quem não desiste. Você já começou. 🚀"
  ];

  const getDailyQuote = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const quoteIndex = dayOfYear % motivationalQuotes.length;
    return motivationalQuotes[quoteIndex];
  };

  return (
    <Card className="bg-green-50 border-green-200">
      <CardHeader className="text-center pb-3">
        <CardTitle className="text-green-600 text-lg font-semibold">
          🎯 Inspiração do Dia
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-lg font-medium text-gray-700 leading-relaxed">
          {getDailyQuote()}
        </p>
      </CardContent>
    </Card>
  );
};

export default DailyInspiration;
