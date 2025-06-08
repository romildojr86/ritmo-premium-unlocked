import { Check, Target, BarChart, TrendingUp, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: <Check className="w-6 h-6 text-green-500" />,
      title: "Registre corridas com facilidade",
      description: "Interface simples e intuitiva para registrar suas corridas em segundos"
    },
    {
      icon: <BarChart className="w-6 h-6 text-green-500" />,
      title: "Veja sua distância semanal",
      description: "Acompanhe seu progresso semanal e mantenha-se motivado"
    },
    {
      icon: <Target className="w-6 h-6 text-green-500" />,
      title: "Desbloqueie metas e desafios no plano Premium",
      description: "Conquiste objetivos personalizados e supere seus limites"
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-green-500" />,
      title: "Acompanhe sua evolução com gráficos",
      description: "Visualize seu progresso com gráficos detalhados e análises completas"
    }
  ];

  const handleSignUp = () => {
    navigate('/auth');
  };

  const handleSignIn = () => {
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 to-white py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Ritmo e Progresso:
            <span className="text-green-500 block">sua corrida evolui com você</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Registre suas corridas, acompanhe metas semanais e veja sua evolução de forma simples e motivadora.
          </p>
          
          {/* Texto destacado */}
          <div className="mb-8 max-w-2xl mx-auto">
            <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              Comece com acesso total por 7 dias.
            </p>
            <p className="text-lg md:text-xl text-gray-600">
              Sem compromisso, sem cartão, sem pegadinhas. Aproveite os recursos Premium com liberdade.
            </p>
          </div>

          {/* Botão único e link de login */}
          <div className="flex flex-col items-center gap-4">
            <Button 
              onClick={handleSignUp}
              size="lg" 
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 max-w-md w-full"
            >
              👉 Criar conta gratuita com acesso Premium
            </Button>
            <button 
              onClick={handleSignIn}
              className="text-gray-600 hover:text-gray-800 text-base font-medium transition-all duration-200 flex items-center gap-2"
            >
              🔓 Já tenho uma conta – Fazer login
            </button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Transforme sua corrida em dados e evolução
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Descubra como o Ritmo e Progresso pode levar sua performance para o próximo nível
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 bg-white">
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {benefit.icon}
                  </div>
                  <CardTitle className="text-lg font-semibold text-gray-900 leading-tight">
                    {benefit.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Ritmo e Progresso</h3>
              <p className="text-gray-400 leading-relaxed">
                A plataforma mais simples e eficaz para corredores que querem evoluir constantemente.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Plataforma</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Como funciona</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Suporte</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Termos de uso</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Política de privacidade</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400 text-lg">
              🏃‍♂️ <strong>Feito por corredores, para corredores.</strong>
            </p>
            <p className="text-gray-500 mt-2">
              © 2024 Ritmo e Progresso. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
