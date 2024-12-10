import { v4 } from 'uuid';
import { SnapPollQuestion } from './SnapPollQuestion';
import { SnapPollOption } from './SnapPollOption';
import { SnapResponse } from './SnapResponse';
import { SnapSharePoll } from './SnapSharePoll';

export class SnapPoll {
  static copy(origin: SnapPoll) {
    return new SnapPoll(origin);
  }

  id: string = v4();
  title: string = '';
  description: string = '';
  createdBy: string = '';
  expiresAt: Date | null = null;
  createdAt: Date = new Date();
  updatedAt: Date = new Date();
  question: SnapPollQuestion[] = [];
  user?: User;
  response?: SnapResponse[];
  sharePoll?: SnapSharePoll;

  constructor(props?: SnapPoll) {
    if (props) {
      this.id = props.id;
      this.title = props.title;
      this.description = props.description;
      this.createdBy = props.createdBy;
      this.expiresAt = props.expiresAt;
      this.question = [...props.question];
      this.createdAt = props.createdAt;
      this.updatedAt = props.updatedAt;
      this.question = props.question;
      this.user = props.user;
      this.response = props.response;
      if (props.sharePoll) this.sharePoll = props.sharePoll;
    }
  }

  addQuestion(question: SnapPollQuestion) {
    this.question = [...this.question, question];
  }

  updateQuestionByInfo<T extends SnapPollQuestion, K extends keyof T>(
    id: string,
    name: K,
    value: T[K],
  ) {
    this.question = this.question.map((q) => {
      if (q.id === id) {
        const copyQuestion = SnapPollQuestion.copy(q);
        Object.assign(copyQuestion, { [name]: value });
        return copyQuestion;
      }
      return q;
    });
  }

  updateOptionByInfo(questionId: string, option: SnapPollOption) {
    this.question = this.question.map((question) => {
      if (question.id === questionId) {
        const copyQuestion = SnapPollQuestion.copy(question);
        const copyOption = SnapPollOption.copy(option);
        copyQuestion.updateOptionByInfo(copyOption);
        return copyQuestion;
      }
      return question;
    });
  }

  updateQuestion(question: SnapPollQuestion) {
    this.question = this.question.map((q) => {
      if (q.id === question.id) {
        return question;
      }
      return q;
    });
  }

  deleteOption(questionId: string, id: string) {
    this.question = this.question.map((question) => {
      if (question.id === questionId) {
        const newQuestion = SnapPollQuestion.copy(question);
        newQuestion.option = newQuestion.option.filter(
          (option) => option.id !== id,
        );
        return newQuestion;
      }
      return question;
    });
  }
}
