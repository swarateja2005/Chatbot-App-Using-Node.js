const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// 🔒 Simple memory for user state
let userMemory = {
  name: null,
  mood: "default"
};

// 🤖 Bot Logic Function
function botLogic(msg) {
  if (typeof msg !== 'string') return "Oops! I was expecting a message in text form.";

  const message = msg.toLowerCase().trim();

  const funFacts = [
    "Honey never spoils. 🍯",
    "Bananas are berries, but strawberries are not. 🍌🍓",
    "Octopuses have three hearts and nine brains! 🐙",
    "A group of flamingos is called a 'flamboyance'. 🦩",
    "The Eiffel Tower can grow more than 6 inches in summer due to heat. 🗼"
  ];

  const quotes = [
    "Believe you can and you're halfway there. — Roosevelt",
    "Your time is limited, so don't waste it. — Steve Jobs",
    "Success is not the key to happiness. — Albert Schweitzer"
  ];

  const badWords = ["stupid", "idiot", "dumb"];

  // 🌈 Mood control
  if (message.startsWith("set mood to ")) {
    const mood = message.replace("set mood to ", "");
    userMemory.mood = mood;
    return `Mood set to ${mood}. Let's roll with it! 🎭`;
  }

  const respond = (text) => {
    if (userMemory.mood === "sarcastic") {
      return `Oh wow... ${text} 🙄`;
    } else if (userMemory.mood === "happy") {
      return `${text} 😄✨`;
    } else {
      return text;
    }
  };

  // 🤖 Core logic
  if (message.includes('hello') || message.includes('hi')) return respond("Hey there! How can I help you?");
  if (message.includes('how are you')) return respond("I'm doing great, thanks for asking! What about you?");
  if (message.includes('bye')) return respond("Goodbye! Take care!");
  if (message.includes('joke')) return respond("Why don't programmers like nature? It has too many bugs.");
  if (message.includes('time')) return respond(`⏰ It's ${new Date().toLocaleTimeString()}`);
  if (message.includes('date')) return respond(`📅 Today is ${new Date().toLocaleDateString()}`);
  if (message.includes('fun fact')) return respond(`🤓 Did you know? ${funFacts[Math.floor(Math.random() * funFacts.length)]}`);
  if (message.includes('quote')) return respond(`💬 ${quotes[Math.floor(Math.random() * quotes.length)]}`);
  if (badWords.some(w => message.includes(w))) return "😔 Let's keep it kind, okay?";
  if (message.includes("roll a dice")) return respond(`🎲 You rolled a ${Math.floor(Math.random() * 6) + 1}`);
  if (message.includes("random number")) return respond(`🎰 Your number is ${Math.floor(Math.random() * 100) + 1}`);

  // 🧡 Name memory
  const nameMatch = message.match(/my name is (\w+)/);
  if (nameMatch) {
    userMemory.name = nameMatch[1];
    return respond(`Nice to meet you, ${userMemory.name}!`);
  }
  if (message.includes("who am i")) {
    return userMemory.name ? respond(`You're ${userMemory.name}! 😊`) : "I don't know yet! Tell me your name by saying: 'my name is ...'";
  }

  // 🎂 Birthday countdown
  const bdayMatch = message.match(/my birthday is (\d{1,2})[-\/](\d{1,2})/);
  if (bdayMatch) {
    const month = parseInt(bdayMatch[1]);
    const day = parseInt(bdayMatch[2]);
    const now = new Date();
    const currentYear = now.getFullYear();
    let nextBirthday = new Date(currentYear, month - 1, day);

    if (now > nextBirthday) {
      nextBirthday.setFullYear(currentYear + 1);
    }

    const diffDays = Math.ceil((nextBirthday - now) / (1000 * 60 * 60 * 24));
    return respond(`🎉 Your birthday is in ${diffDays} day(s)!`);
  }

  // 🔠 Reverse text
  if (message.startsWith("reverse")) {
    const text = msg.slice(7).trim();
    return respond(`🔄 ${text.split('').reverse().join('')}`);
  }

  // 🔡 Uppercase / Lowercase
  if (message.startsWith("uppercase")) return respond(msg.slice(9).trim().toUpperCase());
  if (message.startsWith("lowercase")) return respond(msg.slice(9).trim().toLowerCase());

  // 📖 Word count
  if (message.startsWith("count words")) {
    const text = msg.slice(11).trim();
    const count = text.split(/\s+/).filter(Boolean).length;
    return respond(`📖 Word count: ${count}`);
  }

  // 🎂 Age calculator
  const birthMatch = message.match(/birth year is (\d{4})/);
  if (birthMatch) {
    const birthYear = parseInt(birthMatch[1]);
    const age = new Date().getFullYear() - birthYear;
    return age > 0 && age < 150 ? respond(`🎂 You are about ${age} years old!`) : "🤖 Are you a time traveler?";
  }

  // ➕ Math expression
  const mathPattern = /^(\d+)\s*([\+\-\*\/])\s*(\d+)$/;
  const mathMatch = message.match(mathPattern);
  if (mathMatch) {
    const num1 = parseFloat(mathMatch[1]);
    const operator = mathMatch[2];
    const num2 = parseFloat(mathMatch[3]);
    let result = 0;
    switch (operator) {
      case '+': result = num1 + num2; break;
      case '-': result = num1 - num2; break;
      case '*': result = num1 * num2; break;
      case '/': result = num2 !== 0 ? (num1 / num2).toFixed(2) : 'Infinity'; break;
    }
    return respond(`🧮 ${num1} ${operator} ${num2} = ${result}`);
  }

  // 😍 Emoji Translator
  if (message.startsWith("emoji")) {
    const words = msg.slice(5).trim().split(/\s+/);
    const emojiMap = {
      hello: "👋",
      love: "❤️",
      cool: "😎",
      happy: "😊",
      sad: "😢",
      good: "👍",
      star: "⭐"
    };
    const translated = words.map(word => emojiMap[word.toLowerCase()] || word).join(' ');
    return `🔠 ${translated}`;
  }

  // 🕵️ Default fallback
  return respond("🤔 I don't know that yet. Try saying 'joke', 'reverse hello', 'my birthday is 12-25' or 'emoji happy love'");
}

// 📩 Chatbot POST Endpoint
app.post('/chat', (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) {
    return res.status(400).json({ reply: "Please say something!" });
  }

  const reply = botLogic(userMessage);
  res.json({ reply });
});

// 🚀 Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🤖 Chatbot running at http://localhost:${PORT}`);
});
