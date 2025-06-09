
import { Check, Play, TrendingUp, Heart, Shield, Target, FileText, BarChart3, Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const uniqueFeatures = [
    {
      icon: <Play className="w-8 h-8 text-green-500" />,
      title: "Registro Ilimitado",
      description: "Corridas sem limites, com histórico completo e detalhado."
    },
    {
      icon: <Heart className="w-8 h-8 text-green-500" />,
      title: "Motivação Diária",
      description: "Receba frases inspiradoras para manter o foco e não desistir."
    },
    {
      icon: <Target className="w-8 h-8 text-green-500" />,
      title: "Defina e Acompanhe Metas",
      description: "Visualize seu progresso semanal, mensal e anual de forma clara."
    }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Crie sua conta grátis",
      description: "Ganhe 7 dias de acesso Premium completo"
    },
    {
      step: "2", 
      title: "Registre suas corridas",
      description: "Interface simples e rápida para não perder tempo"
    },
    {
      step: "3",
      title: "Acompanhe sua evolução", 
      description: "Gráficos, metas e progresso em tempo real"
    },
    {
      step: "4",
      title: "Escolha seu plano",
      description: "Continue grátis ou assine o Premium após os 7 dias"
    }
  ];

  const exclusiveFeatures = [
    {
      icon: <BarChart3 className="w-6 h-6 text-green-500" />,
      title: "Painel de Progresso Visual",
      description: "Veja seu desempenho crescer com gráficos intuitivos."
    },
    {
      icon: <FileText className="w-6 h-6 text-green-500" />,
      title: "Notas Personalizadas",
      description: "Escreva o que sentiu após cada corrida."
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-green-500" />,
      title: "Dashboard Simples e Poderoso",
      description: "Acesso direto às suas metas, progresso e histórico."
    },
    {
      icon: <Clock className="w-6 h-6 text-green-500" />,
      title: "Aviso de fim de teste Premium",
      description: "Transparência total — você sabe exatamente quando o teste termina."
    },
    {
      icon: <Calendar className="w-6 h-6 text-green-500" />,
      title: "Histórico completo de corridas",
      description: "Volte no tempo e analise sua evolução."
    },
    {
      icon: <Shield className="w-6 h-6 text-green-500" />,
      title: "Dados Seguros",
      description: "Suas informações protegidas com a mais alta segurança."
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
      <section className="relative bg-gradient-to-br from-green-50 via-white to-green-100 py-20 px-4 min-h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/10"></div>
        <div className="container mx-auto max-w-5xl text-center relative z-10">
          {/* Logo */}
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-green-600">
              Ritmo & Progresso
            </h1>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Organize sua rotina de corridas.
            <span className="text-green-600 block mt-4">Evolua com Ritmo & Progresso.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Tenha acesso total por 7 dias ao plano Premium. Sem cartão, sem compromisso. 
            Descubra uma nova forma de cuidar do seu bem-estar.
          </p>

          {/* CTA Button */}
          <Button 
            onClick={handleSignUp}
            size="lg" 
            className="bg-green-600 hover:bg-green-700 text-white px-12 py-8 text-xl font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
          >
            <Check className="w-7 h-7 mr-4" />
            Criar minha conta gratuita com 7 dias de acesso Premium
          </Button>
        </div>
      </section>

      {/* What Makes Us Unique Section */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              O que faz o Ritmo & Progresso ser único?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Mais do que um app de corridas: seu parceiro de evolução física e mental
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {uniqueFeatures.map((feature, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white group hover:bg-green-50">
                <CardContent className="p-10 text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 group-hover:bg-green-200 transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Como funciona o Ritmo & Progresso?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simples, direto ao ponto e criado para quem quer evoluir sem complicação.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold group-hover:bg-green-700 transition-colors">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exclusive Features Section */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Recursos que ajudam você a manter o ritmo
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {exclusiveFeatures.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group hover:bg-green-50">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-200 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 px-4 bg-green-600">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Comece com Confiança
          </h2>
          <p className="text-xl text-green-100 leading-relaxed">
            Sem cartão, sem pegadinha. Você tem 7 dias para testar tudo com liberdade.
          </p>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <p className="text-2xl md:text-3xl font-light text-gray-700 leading-relaxed">
            Mais de <span className="font-bold text-green-600">50 pessoas</span> já começaram com Ritmo & Progresso para transformar seus hábitos.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-700 font-bold text-lg">
                Ritmo & Progresso
              </p>
              <p className="text-gray-500 mt-1">
                Feito por corredores, para corredores.
              </p>
            </div>
            
            <div className="flex space-x-8 text-sm">
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
