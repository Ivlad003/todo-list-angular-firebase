export class Task {
  id: string;
  created: number;
  index: number;
  text: string;
  isDone = false;

  constructor(text) {
    this.id = this.uuidv4();
    this.created = new Date().getTime();
    this.text = text;
  }

  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
