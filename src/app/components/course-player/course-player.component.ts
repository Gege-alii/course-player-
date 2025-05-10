
import { Component , AfterViewInit , ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

declare var bootstrap: any;

@Component({
  selector: 'app-course-player',
  templateUrl: './course-player.component.html',
  styleUrls: ['./course-player.component.css']
})
export class CoursePlayerComponent {

  constructor(private modalService: NgbModal, private sanitizer: DomSanitizer) {}

   progressWidth = '0%';
   isVideoPlaying = false;
   videoUrl!: SafeResourceUrl;
  
  // Comments 
   defaultComments = [
    {
      image: 'https://newcpsblgr.cutm.ac.in/wp-content/uploads/2020/10/testi22de.jpg',
      name: 'Student Name Goes Here',
      date: 'Oct 10, 2021',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
      image: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcQMCR3Q0JBAwg5LPlTnMhts7IvDhAyqNqQidxPMgAJsr17vbFst',
      name: 'Student Name Goes Here',
      date: 'Oct 15, 2021',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    },
    {
      image: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSZu5JFfEnxia1GPJJSeSM42SDZISSrwbpbyxr1uutagdLChQJ3',
      name: 'Student Name Goes Here',
      date: 'Oct 19, 2021',
      text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    }
  ];
  
  comments: any[] = [];
  newCommentText: string = '';
  
    ngOnInit(): void {

      //comments
    const stored = localStorage.getItem('comments');
    this.comments = stored ? JSON.parse(stored) : [...this.defaultComments];
    if (!stored) {
      localStorage.setItem('comments', JSON.stringify(this.comments));
    }

        // Load saved question input (if any)
      const savedQuestion = localStorage.getItem('studentQuestion');
      if (savedQuestion) {
        this.studentQuestion = savedQuestion;
      }
  
      // Load previous questions from localStorage
      const savedList = localStorage.getItem('studentQuestions');
      if (savedList) {
        this.previousQuestions = JSON.parse(savedList);
      }
  
      //Exam
      const examModalEl = document.getElementById('examModal');
  if (examModalEl) {
    examModalEl.addEventListener('hidden.bs.modal', () => {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    });

      const savedProgress = localStorage.getItem('examProgress');
  if (savedProgress) {
    this.studentAnswers = JSON.parse(savedProgress);
  }    
}    
    }
  
    // Comments
    addComment(comment: any): void {
    this.comments.push(comment);
    localStorage.setItem('comments', JSON.stringify(this.comments));
  }

submitComment(): void {
    if (this.newCommentText.trim()) {
      const newComment = {
        image: 'https://i.pinimg.com/1200x/c5/07/8e/c5078ec7b5679976947d90e4a19e1bbb.jpg',
        name: 'Student',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        text: this.newCommentText.trim()
      };
      this.addComment(newComment);
      this.newCommentText = ''; 
    }
  }
  deleteComment(index: number): void {
    this.comments.splice(index, 1);
    localStorage.setItem('comments', JSON.stringify(this.comments));
  }
   
    ngAfterViewInit(): void {
      setTimeout(() => {
        this.progressWidth = '75%';
      }, 100); 
    }
  
    // Video 
    playVideo() {
      this.isVideoPlaying = true;
      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        'https://www.youtube.com/embed/sd0ypO9MTWY?si=UEKkVRpvlPpg7iDe'
      );
    }
  
  // open PDF
    @ViewChild('pdfModal') pdfModal: any;
    sanitizedPDFUrl: SafeResourceUrl = '';
  
    pdfLinks = {
      introduction: '../assets/images/frontend.pdf',
      overview1: '../assets/images/frontend.pdf',
    };
    openPDF(link: string): void {
      this.sanitizedPDFUrl = this.sanitizer.bypassSecurityTrustResourceUrl(link);
      this.modalService.open(this.pdfModal, { size: 'xl', centered: true });
    }
  
    //icons 
  studentLevel: number = 5;

  //Leaderbord 
  openLeaderboardPopup(): void {
    const leaderboardModal = new bootstrap.Modal(document.getElementById('leaderboardModal'));
    leaderboardModal.show();
  }
  
    //ask question
   studentQuestion: string = '';
   previousQuestions: string[] = [];

    saveQuestion(event: Event): void {
      event.preventDefault();
      const trimmed = this.studentQuestion.trim();
      if (trimmed) {
        this.previousQuestions.push(trimmed);
        localStorage.setItem('studentQuestions', JSON.stringify(this.previousQuestions));
        this.studentQuestion = '';
        localStorage.setItem('studentQuestion', this.studentQuestion);
        Swal.fire({
          icon: 'success',
          title: 'تم الحفظ!',
          text: '✅ تم حفظ سؤالك! يمكنك الرجوع له لاحقًا.',
          confirmButtonText: 'حسنًا'
        });
      }
    }
  
   
  // Scroll smoothly to section
  scrollToSection(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
  
  // Exam 
  examQuestions = [
    {
      question: 'What does HTML stand for?',
      options: ['Hyper Text Markup Language', 'High Text Machine Language', 'Hyperlink and Text Markup Language', 'Home Tool Markup Language'],
      correct: 'Hyper Text Markup Language'
    },
    {
      question: 'Which HTML tag is used to define an internal style sheet?',
      options: ['<style>', '<css>', '<script>', '<head>'],
      correct: '<style>'
    },
    {
      question: 'Which property is used to change the background color in CSS?',
      options: ['color', 'bgcolor', 'background-color', 'background'],
      correct: 'background-color'
    },
    {
      question: 'Which CSS framework is commonly used for responsive design?',
      options: ['Laravel', 'Angular', 'Bootstrap', 'Django'],
      correct: 'Bootstrap'
    },
    {
      question: 'What does DOM stand for?',
      options: ['Document Object Model', 'Data Object Model', 'Design Object Model', 'Document Oriented Model'],
      correct: 'Document Object Model'
    },
    {
      question: 'Which JavaScript method is used to select an element by ID?',
      options: ['getElementById()', 'querySelectorAll()', 'getElementsByClass()', 'getId()'],
      correct: 'getElementById()'
    },
    {
      question: 'Which Angular directive is used for data binding?',
      options: ['*ngFor', '[(ngModel)]', '*ngIf', '[routerLink]'],
      correct: '[(ngModel)]'
    },
    {
      question: 'Which HTML element is used to create a checkbox?',
      options: ['<check>', '<input type="checkbox">', '<checkbox>', '<box>'],
      correct: '<input type="checkbox">'
    },
    {
      question: 'What does CSS stand for?',
      options: ['Cascading Style Sheets', 'Creative Style System', 'Computer Style Sheets', 'Colorful Style Sheets'],
      correct: 'Cascading Style Sheets'
    }
  ];
  

    studentAnswers: string[] = [];
    timerDisplay: string = '01:00';
    private timerInterval: any;
    private timeLeft: number = 60; 

    openExam(event: Event): void {
      event.preventDefault();
      const modal = new (window as any).bootstrap.Modal(document.getElementById('examModal'));
      modal.show();
      this.startTimer();
    }
  
    startTimer(): void {
      this.timeLeft = 60;
      this.updateDisplay();
      this.timerInterval = setInterval(() => {
        this.timeLeft--;
        this.updateDisplay();
  
        if (this.timeLeft <= 0) {
          clearInterval(this.timerInterval);
          this.autoSubmitExam();
        }
      }, 1000);
    }

    startExam(): void {
  this.timeLeft = 60;
  this.studentAnswers = new Array(this.examQuestions.length).fill('');
  this.timerInterval = setInterval(() => {
    this.timeLeft--;
    if (this.timeLeft <= 0) {
      clearInterval(this.timerInterval);
      this.autoSubmitExam();
    }
  }, 1000);
  const examModal = new (window as any).bootstrap.Modal(document.getElementById('examModal'));
  examModal.show();
}

    updateDisplay(): void {
      const minutes = Math.floor(this.timeLeft / 60).toString().padStart(2, '0');
      const seconds = (this.timeLeft % 60).toString().padStart(2, '0');
      this.timerDisplay = `${minutes}:${seconds}`;
    }

   submitExam(event: Event): void {
    event.preventDefault();
    clearInterval(this.timerInterval);
    localStorage.setItem('examProgress', JSON.stringify(this.studentAnswers));
    const result = this.evaluateExam();
    Swal.fire({
      icon: 'success',
      title: '✅ تم إرسال الامتحان',
      html: `عدد الإجابات الصحيحة: <b>${result.correct}</b> من أصل <b>${result.total}</b>`,
      confirmButtonText: 'موافق'
    });
    const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('examModal'));
    modal?.hide();
  }
  
  autoSubmitExam(): void {
    localStorage.setItem('examProgress', JSON.stringify(this.studentAnswers));
    const result = this.evaluateExam();
    Swal.fire({
      icon: 'info',
      title: '⏰ انتهى الوقت',
      html: `عدد الإجابات الصحيحة: <b>${result.correct}</b> من أصل <b>${result.total}</b>`,
      confirmButtonText: 'تمام',
    });
    const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('examModal'));
    modal?.hide();
  }
  
    evaluateExam(): { correct: number; total: number } {
    let correctCount = 0;
    this.examQuestions.forEach((q, i) => {
      if (this.studentAnswers[i] === q.correct) {
        correctCount++;
      }
    });
    return {
      correct: correctCount,
      total: this.examQuestions.length
    };
  }

  currentQuestionIndex = 0;

goToQuestion(index: number) {
  this.currentQuestionIndex = index;
}

prevQuestion() {
  if (this.currentQuestionIndex > 0) this.currentQuestionIndex--;
}

nextQuestion() {
  if (this.currentQuestionIndex < this.examQuestions.length - 1) this.currentQuestionIndex++;
}

selectAnswer(qIndex: number, answer: string) {
  this.studentAnswers[qIndex] = answer;
}
 
}