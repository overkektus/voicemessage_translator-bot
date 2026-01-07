import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";

export class DeepgramService {
  private client;

  constructor(apiKey: string) {
    this.client = createClient(apiKey);
  }

  async transcribeAudio(audioBuffer: Buffer): Promise<string> {
    const { result, error } = await this.client.listen.prerecorded.transcribeFile(
      audioBuffer,
      {
        model: "nova-2",
        language: "ru",
        smart_format: true,
      }
    );

    if (error) {
      throw new Error(`Deepgram transcription error: ${error.message}`);
    }

    return result.results.channels[0].alternatives[0].transcript;
  }
}