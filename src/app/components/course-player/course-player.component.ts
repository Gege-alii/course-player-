
import { Component , OnInit , ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

declare var bootstrap: any;

@Component({
  selector: 'app-course-player',
  templateUrl: './course-player.component.html',
  styleUrls: ['./course-player.component.css']
})
export class CoursePlayerComponent implements OnInit {

  constructor(private modalService: NgbModal, private sanitizer: DomSanitizer, private http: HttpClient) {}

   progressWidth = '0%';
   isVideoPlaying = false;
   videoUrl!: SafeResourceUrl;
  
  // Comments 
  comments: any[] = [];
  newCommentText: string = '';
  apiUrl = 'https://680a11a51f1a52874cdf07f1.mockapi.io/api/v1/comments';
  
    ngOnInit(): void {

      //comments
      this.getComments().subscribe(comments => {
      this.comments = comments;
    });

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
    getComments(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

 submitComment(): void {
  if (this.newCommentText.trim()) {
    const newComment = {
      image: 'https://i.pinimg.com/1200x/c5/07/8e/c5078ec7b5679976947d90e4a19e1bbb.jpg',
      name: 'Student Name',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      text: this.newCommentText.trim()
    };
    this.http.post(this.apiUrl, newComment).subscribe(() => {
      this.getComments().subscribe(comments => {
        this.comments = comments;
      });
    });
    this.newCommentText = ''; 
  }
}

 deleteComment(id: string): void {
  Swal.fire({
    title: 'Are you sure?',
    text: 'Once deleted, you will not be able to recover this comment!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => {
        this.getComments().subscribe(comments => {
          this.comments = comments;
        });
        Swal.fire(
          'Deleted!',
          'Your comment has been deleted.',
          'success'
        );
      });
    }
  });
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