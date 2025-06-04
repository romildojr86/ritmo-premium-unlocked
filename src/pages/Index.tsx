
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

  const scrollToPlans = () => {
    document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleTestFree = () => {
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={handleTestFree}
              size="lg" 
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Testar Grátis Agora
            </Button>
            <Button 
              onClick={scrollToPlans}
              variant="outline" 
              size="lg" 
              className="border-green-500 text-green-600 hover:bg-green-50 px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200"
            >
              Assinar Premium
            </Button>
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

      {/* Plans Section */}
      <section id="plans" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Escolha o plano ideal para você
            </h2>
            <p className="text-xl text-gray-600">
              Comece grátis ou acelere sua evolução com os planos Premium
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <Card className="border-2 border-gray-200 hover:border-gray-300 transition-all duration-200">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  Gratuito
                </CardTitle>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  R$ 0
                  <span className="text-lg font-normal text-gray-600">/sempre</span>
                </div>
                <p className="text-gray-600">Para começar sua jornada</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Até 3 corridas por semana</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Visualização da semana atual</span>
                  </li>
                  <li className="flex items-center gap-3 opacity-50">
                    <span className="w-5 h-5 flex-shrink-0 text-gray-400">❌</span>
                    <span className="text-gray-400">Sem metas ou gráficos</span>
                  </li>
                </ul>
                <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 text-lg font-semibold">
                  Criar Conta Grátis
                </Button>
              </CardContent>
            </Card>

            {/* Monthly Plan */}
            <Card className="border-2 border-green-200 hover:border-green-300 transition-all duration-200">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  Premium Mensal
                </CardTitle>
                <div className="text-4xl font-bold text-green-600 mb-2">
                  R$ 9,70
                  <span className="text-lg font-normal text-gray-600">/mês</span>
                </div>
                <p className="text-gray-600">Flexibilidade total</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Corridas ilimitadas</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Histórico completo</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Metas e desafios</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Gráficos detalhados</span>
                  </li>
                </ul>
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 text-lg font-semibold">
                  Assinar Mensal
                </Button>
              </CardContent>
            </Card>

            {/* Lifetime Plan */}
            <Card className="border-2 border-green-500 relative hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-green-500 text-white px-4 py-1 text-sm font-semibold">
                  🔥 MAIS POPULAR
                </Badge>
              </div>
              <CardHeader className="text-center pb-6 pt-8">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  Premium Vitalício
                </CardTitle>
                <div className="text-4xl font-bold text-green-600 mb-2">
                  R$ 47
                  <span className="text-lg font-normal text-gray-600">/única vez</span>
                </div>
                <p className="text-gray-600">Acesso completo para sempre</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Corridas ilimitadas</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Histórico completo</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Metas e desafios</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Gráficos detalhados</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">Suporte prioritário</span>
                  </li>
                </ul>
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 text-lg font-semibold transition-all duration-200 transform hover:scale-105">
                  Quero Acesso Vitalício
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Special Offer Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Oferta de Lançamento – Vitalício por R$47
          </h2>
          <p className="text-xl mb-6 opacity-90">
            Apenas para os 100 primeiros usuários que acreditam no futuro da corrida
          </p>
          <div className="flex items-center justify-center gap-4 mb-8">
            <Users className="w-6 h-6" />
            <span className="text-lg font-semibold">Restam poucas vagas disponíveis</span>
          </div>
          <Button 
            size="lg" 
            className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Garantir Minha Vaga Agora
          </Button>
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
