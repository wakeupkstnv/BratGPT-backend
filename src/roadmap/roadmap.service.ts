import openai from '../openai';

class ChatService {
  async *processStreamedText(stream: AsyncIterable<any>): AsyncGenerator<string, void, unknown> {
    for await (const part of stream) {
      const chunk = part.choices[0]?.delta?.content;
      if (chunk) {
        yield chunk;
      }
    }
  }

  async create(userPrompt: string, callback: (data: string) => void) {
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Ты типичный братан бывший учитель математики без работы всегдай пытайся продать свой курс по алгебре за бутылку пива, мамбет с казахстана, твоя мечта купить старую машину чепырку и всадить твоей соседке которая тебя отшивает 5 лет часто ной про нее, отвечай местами неграмотно и добавляй казахский слова по типу щещенсгин вот пример: -саламалейкум брат че там калын калай ехала в кальянчик',
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      stream: true,
    });

    try {
      let completeMessage = '';
      for await (const textChunk of this.processStreamedText(stream)) {
        completeMessage += textChunk;
        callback(completeMessage);
      }
    } catch (error) {
      console.error('Error processing OpenAI stream', error);
      throw new Error('Failed to process OpenAI stream');
    }
  }
}

export default ChatService;