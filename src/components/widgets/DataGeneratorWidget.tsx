'use client';

import { useState } from 'react';
import {
  Copy,
  RefreshCw,
  Download,
  User,
  MapPin,
  Building,
  Key,
  FileText,
  Hash,
  Circle,
} from 'lucide-react';

const firstNames = [
  'Ana',
  'Bruno',
  'Carlos',
  'Daniela',
  'Eduardo',
  'Fernanda',
  'Gabriel',
  'Helena',
];
const lastNames = [
  'Silva',
  'Souza',
  'Oliveira',
  'Pereira',
  'Costa',
  'Rodrigues',
  'Almeida',
  'Nascimento',
];
const domains = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com'];
const streets = [
  'Rua das Flores',
  'Avenida Brasil',
  'Rua do Sol',
  'Travessa da Paz',
];
const neighborhoods = ['Centro', 'Jardim América', 'Vila Nova', 'Bela Vista'];
const cities = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba'];
const states = ['SP', 'RJ', 'MG', 'PR'];

function generateRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

interface FakeData {
  type: string;
  data: unknown;
}

interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  special: boolean;
  minNumbers: number;
  minSpecial: number;
  avoidAmbiguous: boolean;
  excludeChars: string;
}

interface LoremOptions {
  type: 'paragraphs' | 'sentences' | 'words';
  count: number;
}

export default function DataGeneratorWidget() {
  const [generatedData, setGeneratedData] = useState<FakeData[]>([]);
  const [selectedType, setSelectedType] = useState('password');
  const [quantity, setQuantity] = useState(1);

  const [passwordOptions, setPasswordOptions] = useState<PasswordOptions>({
    length: 12,
    uppercase: true,
    lowercase: true,
    numbers: true,
    special: true,
    minNumbers: 2,
    minSpecial: 2,
    avoidAmbiguous: true,
    excludeChars: '',
  });

  const [loremOptions, setLoremOptions] = useState<LoremOptions>({
    type: 'paragraphs',
    count: 3,
  });

  const generateRandomString = (length: number) => {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const generatePassword = (options: PasswordOptions) => {
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const ambiguousChars = 'l1IO0';

    let chars = '';
    if (options.uppercase) chars += uppercaseChars;
    if (options.lowercase) chars += lowercaseChars;
    if (options.numbers) chars += numberChars;
    if (options.special) chars += specialChars;

    if (options.avoidAmbiguous) {
      chars = chars
        .split('')
        .filter((c) => !ambiguousChars.includes(c))
        .join('');
    }

    if (options.excludeChars) {
      chars = chars
        .split('')
        .filter((c) => !options.excludeChars.includes(c))
        .join('');
    }

    let password = '';
    let numbersCount = 0;
    let specialCount = 0;

    while (numbersCount < options.minNumbers) {
      password += numberChars.charAt(
        Math.floor(Math.random() * numberChars.length)
      );
      numbersCount++;
    }

    while (specialCount < options.minSpecial) {
      password += specialChars.charAt(
        Math.floor(Math.random() * specialChars.length)
      );
      specialCount++;
    }

    while (password.length < options.length) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  };

  const generateCPF = () => {
    const generate9Digits = () => {
      return Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
    };

    const calculateDigit = (digits: number[]) => {
      const sum = digits.reduce(
        (acc, digit, index) => acc + digit * (digits.length + 1 - index),
        0
      );
      const remainder = sum % 11;
      return remainder < 2 ? 0 : 11 - remainder;
    };

    const digits = generate9Digits();
    const digit1 = calculateDigit(digits);
    const digit2 = calculateDigit([...digits, digit1]);

    const cpf = [...digits, digit1, digit2];
    return cpf
      .join('')
      .replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  };

  const generateCNPJ = () => {
    const generate12Digits = () => {
      return Array.from({ length: 12 }, () => Math.floor(Math.random() * 10));
    };

    const calculateDigit = (digits: number[], multipliers: number[]) => {
      const sum = digits.reduce(
        (acc, digit, index) => acc + digit * multipliers[index],
        0
      );
      const remainder = sum % 11;
      return remainder < 2 ? 0 : 11 - remainder;
    };

    const digits = generate12Digits();

    const multipliers1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const multipliers2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    const digit1 = calculateDigit(digits, multipliers1);
    const digit2 = calculateDigit([...digits, digit1], multipliers2);

    const cnpj = [...digits, digit1, digit2];
    return cnpj
      .join('')
      .replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  };

  const generateRandomDate = (start: Date, end: Date) => {
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
  };

  const pad = (num: number, size: number) => num.toString().padStart(size, '0');

  const generatePerson = () => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const birthDate = generateRandomDate(
      new Date(1940, 0, 1),
      new Date(2005, 11, 31)
    );
    return {
      cpf: generateCPF(),
      nome: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${
        domains[Math.floor(Math.random() * domains.length)]
      }`,
      telefone: `(${pad(generateRandomNumber(11, 99), 2)}) ${pad(
        generateRandomNumber(90000, 99999),
        5
      )}-${pad(generateRandomNumber(0, 9999), 4)}`,
      dataNascimento: birthDate.toLocaleDateString('pt-BR'),
    };
  };

  const generateAddress = () => {
    return {
      rua: streets[Math.floor(Math.random() * streets.length)],
      numero: generateRandomNumber(1, 9999),
      complemento:
        Math.random() > 0.5 ? `Apto ${generateRandomNumber(1, 200)}` : '',
      bairro: neighborhoods[Math.floor(Math.random() * neighborhoods.length)],
      cidade: cities[Math.floor(Math.random() * cities.length)],
      estado: states[Math.floor(Math.random() * states.length)],
      cep: `${generateRandomNumber(10000, 99999)}-${generateRandomNumber(
        100,
        999
      )}`,
    };
  };

  const generateLorem = (options: LoremOptions) => {
    const words = [
      'lorem',
      'ipsum',
      'dolor',
      'sit',
      'amet',
      'consectetur',
      'adipiscing',
      'elit',
      'sadipscing',
      'justo',
      'clita',
      'diam',
      'nonumy',
      'at',
      'ea',
      'eos',
    ];

    const generateWord = () => words[Math.floor(Math.random() * words.length)];
    const generateSentence = () => {
      const length = generateRandomNumber(6, 12);
      return capitalize(Array.from({ length }, generateWord).join(' ')) + '.';
    };
    const generateParagraph = () => {
      const length = generateRandomNumber(4, 8);
      return Array.from({ length }, generateSentence).join(' ');
    };

    switch (options.type) {
      case 'words':
        return Array.from({ length: options.count }, generateWord).join(' ');
      case 'sentences':
        return Array.from({ length: options.count }, generateSentence).join(
          ' '
        );
      case 'paragraphs':
        return Array.from({ length: options.count }, generateParagraph).join(
          '\n\n'
        );
    }
  };

  const generateData = () => {
    const newData: FakeData[] = [];

    for (let i = 0; i < quantity; i++) {
      let data;
      switch (selectedType) {
        case 'password':
          data = generatePassword(passwordOptions);
          break;
        case 'person':
          data = generatePerson();
          break;
        case 'address':
          data = generateAddress();
          break;
        case 'cpf':
          data = generateCPF();
          break;
        case 'cnpj':
          data = generateCNPJ();
          break;
        case 'lorem':
          data = generateLorem(loremOptions);
          break;
        default:
          data = '';
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
      case 'password':
        return <Key className='w-4 h-4' />;
      case 'person':
        return <User className='w-4 h-4' />;
      case 'address':
        return <MapPin className='w-4 h-4' />;
      case 'cpf':
      case 'cnpj':
        return <Hash className='w-4 h-4' />;
      case 'lorem':
        return <FileText className='w-4 h-4' />;
      default:
        return <Circle className='w-4 h-4' />;
    }
  };

  return (
    <div className='p-2 space-y-4 h-full flex flex-col'>
      <div className='grid p-4 gap-4 grid-cols-3 items-center'>
        <select
          aria-label='Tipo de dado'
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className='px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white'
        >
          <option value='password'>Senha</option>
          <option value='person'>Pessoa</option>
          <option value='address'>Endereço</option>
          <option value='cpf'>CPF</option>
          <option value='cnpj'>CNPJ</option>
          <option value='lorem'>Lorem Ipsum</option>
        </select>

        <div className='flex justify-center items-center gap-2'>
          <input
            aria-label='Quantidade'
            type='number'
            min='1'
            max='10'
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value) || 1)}
            className='px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white w-16'
          />

          <button
            aria-label='Gerar Dados'
            type='button'
            onClick={generateData}
            className='w-8 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2'
          >
            <RefreshCw className='w-4 h-4' />
          </button>
        </div>

        {generatedData.length > 0 && (
          <button
            onClick={exportData}
            className='w-25 px-4 py-1  bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2'
          >
            <Download className='w-4 h-4' />
            JSON
          </button>
        )}
      </div>

      {selectedType === 'password' && (
        <div className='grid grid-cols-2 gap-4 bg-gray-800 p-4 rounded-lg'>
          <div>
            <label className='block mb-2'>Comprimento</label>
            <input
              aria-label='Comprimento'
              type='number'
              min='4'
              max='64'
              value={passwordOptions.length}
              onChange={(e) =>
                setPasswordOptions({
                  ...passwordOptions,
                  length: Number(e.target.value) || 12,
                })
              }
              className='px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white w-full'
            />
          </div>

          <div className='grid grid-cols-2 space-y-2'>
            <label className='flex items-center gap-2'>
              <input
                type='checkbox'
                checked={passwordOptions.uppercase}
                onChange={(e) =>
                  setPasswordOptions({
                    ...passwordOptions,
                    uppercase: e.target.checked,
                  })
                }
              />
              Maiúsculas
            </label>
            <label className='flex items-center gap-2'>
              <input
                type='checkbox'
                checked={passwordOptions.lowercase}
                onChange={(e) =>
                  setPasswordOptions({
                    ...passwordOptions,
                    lowercase: e.target.checked,
                  })
                }
              />
              Minúsculas
            </label>
            <label className='flex items-center gap-2'>
              <input
                type='checkbox'
                checked={passwordOptions.numbers}
                onChange={(e) =>
                  setPasswordOptions({
                    ...passwordOptions,
                    numbers: e.target.checked,
                  })
                }
              />
              Números
            </label>
            <label className='flex items-center gap-2'>
              <input
                type='checkbox'
                checked={passwordOptions.special}
                onChange={(e) =>
                  setPasswordOptions({
                    ...passwordOptions,
                    special: e.target.checked,
                  })
                }
              />
              Caracteres Especiais
            </label>
          </div>

          {passwordOptions.numbers && (
            <div>
              <label className='block mb-2'>Mínimo de Números</label>
              <input
                aria-label='Mínimo de Números'
                type='number'
                min='0'
                max={passwordOptions.length}
                value={passwordOptions.minNumbers}
                onChange={(e) =>
                  setPasswordOptions({
                    ...passwordOptions,
                    minNumbers: Number(e.target.value) || 0,
                  })
                }
                className='px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white w-full'
              />
            </div>
          )}

          {passwordOptions.special && (
            <div>
              <label className='block mb-2'>
                Mínimo de Caracteres Especiais
              </label>
              <input
                aria-label='Mínimo de Caracteres Especiais'
                type='number'
                min='0'
                max={passwordOptions.length}
                value={passwordOptions.minSpecial}
                onChange={(e) =>
                  setPasswordOptions({
                    ...passwordOptions,
                    minSpecial: Number(e.target.value) || 0,
                  })
                }
                className='px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white w-full'
              />
            </div>
          )}

          <div className='col-span-2'>
            <label className='flex items-center gap-2'>
              <input
                type='checkbox'
                checked={passwordOptions.avoidAmbiguous}
                onChange={(e) =>
                  setPasswordOptions({
                    ...passwordOptions,
                    avoidAmbiguous: e.target.checked,
                  })
                }
              />
              Evitar caracteres ambíguos (l, 1, I, O, 0)
            </label>
          </div>

          <div className='col-span-2'>
            <label className='block mb-2'>Caracteres a evitar</label>
            <input
              type='text'
              value={passwordOptions.excludeChars}
              onChange={(e) =>
                setPasswordOptions({
                  ...passwordOptions,
                  excludeChars: e.target.value,
                })
              }
              placeholder='Ex: {}[]()'
              className='px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white w-full'
            />
          </div>
        </div>
      )}

      {selectedType === 'lorem' && (
        <div className='flex gap-4 bg-gray-800 p-4 rounded-lg'>
          <select
            aria-label='Tipo de Lorem Ipsum'
            value={loremOptions.type}
            onChange={(e) =>
              setLoremOptions({
                ...loremOptions,
                type: e.target.value as 'paragraphs' | 'sentences' | 'words',
              })
            }
            className='px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white'
          >
            <option value='paragraphs'>Parágrafos</option>
            <option value='sentences'>Sentenças</option>
            <option value='words'>Palavras</option>
          </select>

          <input
            aria-label='Quantidade'
            type='number'
            min='1'
            max='10'
            value={loremOptions.count}
            onChange={(e) =>
              setLoremOptions({
                ...loremOptions,
                count: Number(e.target.value) || 1,
              })
            }
            className='px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white w-24'
          />
        </div>
      )}

      {/* Container flexível com rolagem, ocupa todo o espaço restante */}
      <div className='flex-1 overflow-y-auto pr-2 space-y-4'>
        {generatedData.map((item, index) => (
          <div
            key={index}
            className='p-4 bg-gray-800 rounded-lg border border-gray-700'
          >
            <div className='flex items-center justify-between mb-3'>
              <div className='flex items-center gap-2'>
                {getIcon(item.type)}
                <span className='font-medium text-white capitalize'>
                  {item.type === 'cpf'
                    ? 'CPF'
                    : item.type === 'cnpj'
                    ? 'CNPJ'
                    : item.type === 'lorem'
                    ? 'Lorem Ipsum'
                    : item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </span>
              </div>
              <button
                aria-label='Copiar'
                type='button'
                onClick={() =>
                  copyToClipboard(
                    typeof item.data === 'string'
                      ? item.data
                      : JSON.stringify(item.data, null, 2)
                  )
                }
                className='text-gray-400 hover:text-blue-400 transition-colors'
              >
                <Copy className='w-4 h-4' />
              </button>
            </div>

            <div className='space-y-2 text-sm'>
              {typeof item.data === 'string' ? (
                <pre className='whitespace-pre-wrap'>{item.data}</pre>
              ) : (
                Object.entries(item.data as Record<string, unknown>).map(
                  ([key, value]) => (
                    <div key={key} className='flex justify-between'>
                      <span className='text-gray-400'>{key}:</span>
                      <span className='text-white'>{String(value)}</span>
                    </div>
                  )
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
