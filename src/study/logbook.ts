export interface StudySession {
  id: string;
  date: string;
  topic: string;
  minutes: number;
  note?: string;
}

export class StudyLogbook {
  private sessions: StudySession[] = [];

  add(session: StudySession): void {
    if (!session.topic.trim()) throw new Error('topic required');
    if (session.minutes <= 0) throw new Error('minutes must be positive');
    this.sessions.push(session);
  }

  listByDate(date: string): StudySession[] {
    return this.sessions.filter(s => s.date === date);
  }

  totalMinutes(date: string): number {
    return this.listByDate(date).reduce((sum, s) => sum + s.minutes, 0);
  }
}
