
import { Check, Play, TrendingUp, Heart, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: <Play className="w-8 h-8 text-green-500" />,
      title: "Corridas ilimitadas",
      description: "Registre suas corridas sem limites e acompanhe sua performance."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-green-500" />,
      title: "Gráficos e Metas",
      description: "Monitore sua evolução e alcance objetivos com clareza."
    },
    {
      icon: <Heart className="w-8 h-8 text-green-500" />,
      title: "Motivação Diária",
      description: "Receba inspirações diárias para manter o foco e o ritmo."
    },
    {
      icon: <Shield className="w-8 h-8 text-green-500" />,
      title: "Sem cartão de crédito",
      description: "Comece sem compromisso. Liberdade total para testar o Premium."
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
      {/* Header with Login Link */}
      <header className="absolute top-0 right-0 p-6 z-10">
        <button 
          onClick={handleSignIn}
          className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
        >
          Já tenho uma conta
        </button>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 via-white to-green-25 py-20 px-4 min-h-[80vh] flex items-center">
        <div className="container mx-auto max-w-4xl text-center">
          {/* Logo */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-green-600 mb-12">
              Ritmo & Progresso
            </h1>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Comece sua jornada com
            <span className="text-green-500 block mt-2">Ritmo & Progresso</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            Acompanhe suas corridas, metas e evolução com liberdade. 
            Comece com 7 dias grátis no plano Premium – sem cartão, sem pegadinhas.
          </p>

          {/* CTA Button */}
          <Button 
            onClick={handleSignUp}
            size="lg" 
            className="bg-green-500 hover:bg-green-600 text-white px-10 py-6 text-lg font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <Check className="w-6 h-6 mr-3" />
            Criar minha conta gratuita com 7 dias de acesso Premium
          </Button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-none shadow-md hover:shadow-lg transition-all duration-200 bg-white">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-2xl md:text-3xl font-light text-gray-700 leading-relaxed">
            Mais de <span className="font-semibold text-green-600">50 pessoas</span> já começaram a transformar seus hábitos com Ritmo & Progresso.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-600 font-medium">
                Ritmo & Progresso
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Feito por corredores, para corredores.
              </p>
            </div>
            
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors">
                Termos de uso
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors">
                Política de privacidade
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700 transition-colors">
                Contato
              </a>
            </div>
          </div>
          
          <div className="border-t border-gray-200 mt-8 pt-6 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 Ritmo & Progresso. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
