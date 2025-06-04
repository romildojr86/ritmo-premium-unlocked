
import { Check, Target, BarChart, Award, Brain, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const benefits = [
    {
      icon: <Check className="w-6 h-6 text-green-500" />,
      title: "Corridas ilimitadas",
      description: "Registre quantas corridas quiser, sem limitações"
    },
    {
      icon: <BarChart className="w-6 h-6 text-green-500" />,
      title: "Gráficos completos",
      description: "Análises semanais, mensais e anuais do seu progresso"
    },
    {
      icon: <Target className="w-6 h-6 text-green-500" />,
      title: "Metas automáticas",
      description: "Sistema inteligente que cria metas personalizadas"
    },
    {
      icon: <Award className="w-6 h-6 text-green-500" />,
      title: "Desafios e motivação",
      description: "Conquiste medalhas e mantenha-se motivado"
    },
    {
      icon: <Brain className="w-6 h-6 text-green-500" />,
      title: "Histórico completo",
      description: "Acesso total ao seu histórico de corridas"
    },
    {
      icon: <Download className="w-6 h-6 text-green-500" />,
      title: "Exportar dados",
      description: "Baixe todos os seus dados quando quiser"
    }
  ];

  const comparisonFeatures = [
    { feature: "Número de corridas", free: "Até 10", premium: "Ilimitadas" },
    { feature: "Gráficos de progresso", free: "Básicos", premium: "Completos" },
    { feature: "Metas personalizadas", free: "❌", premium: "✅" },
    { feature: "Desafios e medalhas", free: "❌", premium: "✅" },
    { feature: "Histórico completo", free: "30 dias", premium: "Ilimitado" },
    { feature: "Exportar dados", free: "❌", premium: "✅" },
    { feature: "Suporte prioritário", free: "❌", premium: "✅" }
  ];

  const scrollToPlans = () => {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 to-white py-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <Badge className="mb-6 bg-green-100 text-green-800 hover:bg-green-100">
            🏃‍♂️ Para corredores apaixonados
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Seu progresso,
            <span className="text-green-500 block">desbloqueado.</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Escolha o plano ideal para evoluir sua jornada de corrida com análises profundas, 
            metas inteligentes e muito mais.
          </p>
          <Button 
            onClick={scrollToPlans}
            size="lg" 
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Ver Planos Premium
          </Button>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Por que escolher o Premium?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Desbloqueie todo o potencial do Ritmo e Progresso com recursos exclusivos
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
                <CardHeader className="text-center pb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {benefit.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {benefit.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Gratuito vs Premium
            </h2>
            <p className="text-xl text-gray-600">
              Veja todas as vantagens do plano Premium
            </p>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-200 shadow-lg">
            <div className="bg-gray-50 px-6 py-4 grid grid-cols-3 gap-4 font-semibold text-gray-900">
              <div></div>
              <div className="text-center">Gratuito</div>
              <div className="text-center bg-green-500 text-white rounded-lg py-2">Premium ⭐</div>
            </div>
            
            {comparisonFeatures.map((item, index) => (
              <div key={index} className={`px-6 py-4 grid grid-cols-3 gap-4 items-center ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <div className="font-medium text-gray-900">{item.feature}</div>
                <div className="text-center text-gray-600">{item.free}</div>
                <div className="text-center font-semibold text-green-600">{item.premium}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-gradient-to-br from-green-50 to-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Escolha seu plano
            </h2>
            <p className="text-xl text-gray-600">
              Invista no seu progresso com preços que cabem no seu bolso
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Monthly Plan */}
            <Card className="border-2 border-gray-200 hover:border-green-300 transition-all duration-200">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  Plano Mensal
                </CardTitle>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  R$ 9,70
                  <span className="text-lg font-normal text-gray-600">/mês</span>
                </div>
                <p className="text-gray-600">Flexibilidade total, cancele quando quiser</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {benefits.slice(0, 4).map((benefit, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{benefit.title}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 text-lg font-semibold mt-8">
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
              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                  Acesso Vitalício
                </CardTitle>
                <div className="text-4xl font-bold text-green-600 mb-2">
                  R$ 47
                  <span className="text-lg font-normal text-gray-600">/única vez</span>
                </div>
                <p className="text-gray-600">Economia de mais de 80% vs mensal</p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
                  <p className="text-red-700 text-sm font-medium">
                    ⚡ Oferta vitalícia disponível apenas para os 100 primeiros
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{benefit.title}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 text-lg font-semibold mt-8 transition-all duration-200 transform hover:scale-105">
                  Garantir Vitalício
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 max-w-2xl mx-auto">
              💡 <strong>Dica:</strong> O plano vitalício equivale a apenas 5 meses do plano mensal. 
              Perfeito para quem está comprometido com seus objetivos de corrida.
            </p>
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
                O app de corrida mais completo para acompanhar sua evolução e alcançar seus objetivos.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-white transition-colors">WhatsApp</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Política de Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Política de Reembolso</a></li>
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
