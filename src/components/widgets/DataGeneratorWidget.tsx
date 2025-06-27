'use client';

import { useState } from 'react';
import {
  Copy,
  RefreshCw,
  Download,
  User,
  MapPin,
  Building,
  CreditCard,
} from 'lucide-react';

interface FakeData {
  type: string;
  data: unknown;
}

export default function DataGeneratorWidget() {
  const [generatedData, setGeneratedData] = useState<FakeData[]>([]);
  const [selectedType, setSelectedType] = useState('person');
  const [quantity, setQuantity] = useState(1);

  const generateRandomString = (length: number) => {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const generateRandomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const generateRandomDate = (start: Date, end: Date) => {
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
  };

  const firstNames = [
    'Ana',
    'João',
    'Maria',
    'Pedro',
    'Carla',
    'Lucas',
    'Fernanda',
    'Rafael',
    'Juliana',
    'Bruno',
    'Camila',
    'Diego',
    'Larissa',
    'Thiago',
    'Beatriz',
  ];
  const lastNames = [
    'Silva',
    'Santos',
    'Oliveira',
    'Souza',
    'Rodrigues',
    'Ferreira',
    'Alves',
    'Pereira',
    'Lima',
    'Gomes',
    'Costa',
    'Ribeiro',
    'Martins',
    'Carvalho',
    'Almeida',
  ];
  const domains = [
    'gmail.com',
    'hotmail.com',
    'yahoo.com',
    'outlook.com',
    'uol.com.br',
    'terra.com.br',
  ];
  const cities = [
    'São Paulo',
    'Rio de Janeiro',
    'Belo Horizonte',
    'Salvador',
    'Brasília',
    'Fortaleza',
    'Curitiba',
    'Recife',
    'Porto Alegre',
    'Manaus',
  ];
  const companies = [
    'Tech Solutions',
    'Inovação Digital',
    'Sistemas Avançados',
    'Consultoria Plus',
    'Desenvolvimento Web',
    'Software House',
    'TI Moderna',
    'Código Limpo',
  ];

  const generatePerson = () => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${domains[Math.floor(Math.random() * domains.length)]}`;

    return {
      id: generateRandomString(8),
      name: `${firstName} ${lastName}`,
      email: email,
      phone: `(${generateRandomNumber(11, 99)}) ${generateRandomNumber(90000, 99999)}-${generateRandomNumber(1000, 9999)}`,
      age: generateRandomNumber(18, 80),
      city: cities[Math.floor(Math.random() * cities.length)],
      birthDate: generateRandomDate(
        new Date(1940, 0, 1),
        new Date(2005, 11, 31)
      ).toLocaleDateString('pt-BR'),
      cpf: `${generateRandomNumber(100, 999)}.${generateRandomNumber(100, 999)}.${generateRandomNumber(100, 999)}-${generateRandomNumber(10, 99)}`,
    };
  };

  const generateCompany = () => {
    const name = companies[Math.floor(Math.random() * companies.length)];
    return {
      id: generateRandomString(6),
      name: name,
      cnpj: `${generateRandomNumber(10, 99)}.${generateRandomNumber(100, 999)}.${generateRandomNumber(100, 999)}/0001-${generateRandomNumber(10, 99)}`,
      email: `contato@${name.toLowerCase().replace(/\s+/g, '')}.com.br`,
      phone: `(${generateRandomNumber(11, 99)}) ${generateRandomNumber(3000, 3999)}-${generateRandomNumber(1000, 9999)}`,
      city: cities[Math.floor(Math.random() * cities.length)],
      employees: generateRandomNumber(10, 500),
      founded: generateRandomNumber(1990, 2020),
    };
  };

  const generateCreditCard = () => {
    const brands = ['Visa', 'Mastercard', 'American Express', 'Elo'];
    const brand = brands[Math.floor(Math.random() * brands.length)];

    return {
      id: generateRandomString(8),
      brand: brand,
      number: `${generateRandomNumber(1000, 9999)} ${generateRandomNumber(1000, 9999)} ${generateRandomNumber(1000, 9999)} ${generateRandomNumber(1000, 9999)}`,
      holder: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      expiry: `${generateRandomNumber(1, 12).toString().padStart(2, '0')}/${generateRandomNumber(24, 30)}`,
      cvv: generateRandomNumber(100, 999).toString(),
      limit: `R$ ${generateRandomNumber(1000, 50000).toLocaleString('pt-BR')}`,
    };
  };

  const generateAddress = () => {
    const streets = [
      'Rua das Flores',
      'Avenida Principal',
      'Rua do Comércio',
      'Avenida Central',
      'Rua da Paz',
      'Avenida Brasil',
    ];
    const neighborhoods = [
      'Centro',
      'Jardim América',
      'Vila Nova',
      'Bela Vista',
      'Copacabana',
      'Ipanema',
    ];

    return {
      id: generateRandomString(8),
      street: `${streets[Math.floor(Math.random() * streets.length)]}, ${generateRandomNumber(1, 9999)}`,
      neighborhood:
        neighborhoods[Math.floor(Math.random() * neighborhoods.length)],
      city: cities[Math.floor(Math.random() * cities.length)],
      state: 'SP',
      zipCode: `${generateRandomNumber(10000, 99999)}-${generateRandomNumber(100, 999)}`,
      complement:
        Math.random() > 0.5 ? `Apto ${generateRandomNumber(1, 200)}` : '',
    };
  };

  const generateData = () => {
    const newData: FakeData[] = [];

    for (let i = 0; i < quantity; i++) {
      let data;
      switch (selectedType) {
        case 'person':
          data = generatePerson();
          break;
        case 'company':
          data = generateCompany();
          break;
        case 'creditCard':
          data = generateCreditCard();
          break;
        case 'address':
          data = generateAddress();
          break;
        default:
          data = generatePerson();
      }

      newData.push({
        type: selectedType,
        data: data,
      });
    }

    setGeneratedData(newData);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const exportData = () => {
    const dataStr = JSON.stringify(generatedData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fake-data-${selectedType}-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'person':
        return <User className='w-4 h-4' />;
      case 'company':
        return <Building className='w-4 h-4' />;
      case 'creditCard':
        return <CreditCard className='w-4 h-4' />;
      case 'address':
        return <MapPin className='w-4 h-4' />;
      default:
        return <User className='w-4 h-4' />;
    }
  };

  const renderDataItem = (item: FakeData, index: number) => {
    const { type, data } = item;

    return (
      <div
        key={index}
        className='p-4 bg-gray-800 rounded-lg border border-gray-700'
      >
        <div className='flex items-center justify-between mb-3'>
          <div className='flex items-center gap-2'>
            {getIcon(type)}
            <span className='font-medium text-white capitalize'>
              {type === 'creditCard'
                ? 'Cartão de Crédito'
                : type === 'person'
                  ? 'Pessoa'
                  : type === 'company'
                    ? 'Empresa'
                    : 'Endereço'}
            </span>
          </div>
          <button
            onClick={() => copyToClipboard(JSON.stringify(data, null, 2))}
            className='text-gray-400 hover:text-blue-400 transition-colors'
          >
            <Copy className='w-4 h-4' />
          </button>
        </div>

        <div className='space-y-2 text-sm'>
          {Object.entries(item.data as Record<string, any>).map(
            ([key, value]) => (
              <div key={key} className='flex justify-between'>
                <span className='text-gray-400 capitalize'>{key}:</span>
                <span className='text-white font-mono'>{value}</span>
              </div>
            )
          )}
        </div>
      </div>
    );
  };

  return (
    <div className='p-4 h-full flex flex-col'>
      {/* Header */}
      <div className='flex items-center gap-2 mb-4'>
        <RefreshCw className='w-5 h-5 text-green-400' />
        <h2 className='text-lg font-semibold text-white'>Gerador de Dados</h2>
      </div>

      {/* Controls */}
      <div className='mb-4 space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm text-gray-400 mb-2'>
              Tipo de Dados
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className='w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500'
            >
              <option value='person'>Pessoa</option>
              <option value='company'>Empresa</option>
              <option value='creditCard'>Cartão de Crédito</option>
              <option value='address'>Endereço</option>
            </select>
          </div>

          <div>
            <label className='block text-sm text-gray-400 mb-2'>
              Quantidade
            </label>
            <input
              type='number'
              min='1'
              max='10'
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  Math.max(1, Math.min(10, parseInt(e.target.value) || 1))
                )
              }
              className='w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500'
            />
          </div>
        </div>

        <div className='flex gap-2'>
          <button
            onClick={generateData}
            className='flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors'
          >
            <RefreshCw className='w-4 h-4' />
            Gerar Dados
          </button>

          {generatedData.length > 0 && (
            <button
              onClick={exportData}
              className='flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors'
            >
              <Download className='w-4 h-4' />
              Exportar JSON
            </button>
          )}
        </div>
      </div>

      {/* Generated Data */}
      <div className='flex-1 overflow-y-auto'>
        {generatedData.length === 0 ? (
          <div className='text-center py-8 text-gray-400'>
            <RefreshCw className='w-12 h-12 mx-auto mb-2 opacity-50' />
            <p>Nenhum dado gerado ainda</p>
            <p className='text-sm'>
              Selecione o tipo e clique em &quot;Gerar Dados&quot;
            </p>
          </div>
        ) : (
          <div className='space-y-4'>
            {generatedData.map((item, index) => renderDataItem(item, index))}
          </div>
        )}
      </div>
    </div>
  );
}
