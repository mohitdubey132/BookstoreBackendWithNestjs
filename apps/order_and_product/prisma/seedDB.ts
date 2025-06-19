import { PrismaClient } from '../generated/prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      {
        name: 'गोदान',
        description: 'मुंशी प्रेमचंद का प्रसिद्ध उपन्यास',
        price: 29900,
        stock: 50,
      },
      {
        name: 'निर्मला',
        description: 'एक सामाजिक मुद्दों पर आधारित हिंदी उपन्यास',
        price: 25900,
        stock: 40,
      },
      {
        name: 'रंगभूमि',
        description: 'प्रेमचंद का सामाजिक संघर्ष का चित्रण',
        price: 31900,
        stock: 30,
      },
      {
        name: 'कर्मभूमि',
        description: 'कर्म और समाज पर आधारित उपन्यास',
        price: 28900,
        stock: 35,
      },
      {
        name: 'गबन',
        description: 'नैतिकता और लालच की कहानी',
        price: 31000,
        stock: 25,
      },
      {
        name: 'India After Gandhi',
        description: 'भारत की आधुनिक राजनीतिक इतिहास',
        price: 49900,
        stock: 20,
      },
      {
        name: 'The Discovery of India',
        description: 'नेहरू द्वारा लिखित भारत का दर्शन',
        price: 39900,
        stock: 20,
      },
      {
        name: 'The Guide',
        description: 'R.K. Narayan की एक रोमांचक कथा',
        price: 34900,
        stock: 40,
      },
      {
        name: 'Malgudi Days',
        description: 'R.K. Narayan की लघु कथाएँ',
        price: 27900,
        stock: 50,
      },
      {
        name: 'Swami and Friends',
        description: 'बाल जीवन पर आधारित कहानी',
        price: 29900,
        stock: 35,
      },
      {
        name: 'Half Girlfriend',
        description: 'Chetan Bhagat की रोमांटिक कहानी',
        price: 19900,
        stock: 45,
      },
      {
        name: 'Revolution 2020',
        description: 'प्यार, भ्रष्टाचार और महत्वाकांक्षा की कहानी',
        price: 18900,
        stock: 30,
      },
      {
        name: '2 States',
        description: 'अंतर-सांस्कृतिक प्रेम कहानी',
        price: 21000,
        stock: 50,
      },
      {
        name: 'Train to Pakistan',
        description: 'भारत विभाजन की पृष्ठभूमि में लिखी गई कहानी',
        price: 23900,
        stock: 40,
      },
      {
        name: 'A Suitable Boy',
        description: 'एक विस्तृत भारतीय परिवार गाथा',
        price: 59900,
        stock: 15,
      },
      {
        name: 'Waiting for Mahatma',
        description: 'गांधीजी के प्रभाव में एक युवा का जीवन',
        price: 26900,
        stock: 20,
      },
      {
        name: 'Pinjar',
        description: 'विभाजन और महिलाओं की पीड़ा',
        price: 28900,
        stock: 30,
      },
      {
        name: 'Yama',
        description: 'महादेवी वर्मा की काव्य रचनाएँ',
        price: 19900,
        stock: 25,
      },
      {
        name: 'Kamayani',
        description: 'जयशंकर प्रसाद की प्रसिद्ध महाकाव्य',
        price: 31900,
        stock: 20,
      },
      {
        name: 'Ramcharitmanas',
        description: 'तुलसीदास की भक्ति महाकाव्य',
        price: 39900,
        stock: 35,
      },
    ],
  });

  console.log('✅ Seeded 20 literature books.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
