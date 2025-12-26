
// Enums
export enum EmployeeStatus {
  ACTIVE = 'مستمر بالخدمة',
  ON_LEAVE = 'إجازة اعتيادية/مرضية',
  TERMINATED = 'منهي خدماته',
  PROBATION = 'تحت التجربة',
  RETIRED = 'متقاعد',
  TRANSFERRED = 'منقول',
  ABSENT = 'غائب'
}

export enum ContractType {
  PERMANENT = 'الملاك الدائم',
  TEMPORARY = 'عقد مؤقت',
  CONTRACT_315 = 'عقود قرار 315',
  DAILY_WAGE = 'أجر يومي',
  MINISTERIAL_ORDER = 'أمر وزاري',
  SECONDMENT = 'تنسيب',
  CIVIL = 'موظف مدني',
  MILITARY = 'عسكري / دفاع',
  INTELLIGENCE = 'استخبارات',
  SOCIAL_WELFARE = 'رعاية اجتماعية',
  POOR_FAMILIES = 'عوائل متعففة'
}

export enum RecruitmentType {
  CENTRAL = 'التعيين المركزي (الصحة)',
  FPSC = 'مجلس الخدمة الاتحادي',
  MOVEMENT = 'حركة الملاك',
  CONTRACT_315 = 'عقود قرار 315',
  DAILY_WAGE = 'أجر يومي',
  ELECTRICITY_CONTRACT = 'عقود وزارة الكهرباء'
}

export enum ApplicantStatus {
  PENDING_AUDIT = 'قيد التدقيق',
  POINTS_CALC = 'احتساب النقاط',
  INTERVIEW = 'مقابلة',
  ACCEPTED = 'مقبول (أمر إداري)',
  REJECTED = 'مرفوض',
  RESERVE = 'احتياط'
}

// Accounting Enums
export enum AccountType {
  ASSET = 'الأصول',
  LIABILITY = 'الخصوم',
  EQUITY = 'حقوق الملكية',
  REVENUE = 'الإيرادات',
  EXPENSE = 'المصروفات'
}

export enum JournalStatus {
  DRAFT = 'مسودة',
  POSTED = 'مرحل',
  CANCELLED = 'ملغي'
}

export enum InvoiceStatus {
  DRAFT = 'مسودة',
  SENT = 'مرسل',
  PAID = 'مدفوع',
  PARTIAL = 'دفع جزئي',
  OVERDUE = 'متأخر',
  VOID = 'ملغي'
}

export type JobGrade = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type ThemeType = 'default' | 'defense' | 'interior' | 'health' | 'corporate' | 'gold' | 'carbon' | 'crimson' | 'emerald' | 'violet' | 'royal';

// Interfaces
export interface Employee {
  id: string; // Job ID (الرقم الوظيفي)
  financialNumber: string; // الرقم المالي
  name: string;
  motherName?: string; // اسم الأم
  gender?: 'Male' | 'Female';
  dob?: string;
  birthPlace?: string; // محل الولادة
  nationalId?: string; // الرقم الوطني الموحد
  issuanceDate?: string; // تاريخ إصدار الهوية
  
  role: string; // Job Title (العنوان الوظيفي)
  department: string;
  section?: string; // الشعبة
  
  grade: JobGrade; // الدرجة الوظيفية
  step: number; // المرحلة (1-11)
  
  joinDate: string; // تاريخ التعيين لأول مرة
  currentGradeDate?: string; // تاريخ الحصول على الدرجة الحالية
  lastIncrementDate?: string; // تاريخ آخر علاوة
  nextIncrementDate?: string; // تاريخ العلاوة القادمة
  nextPromotionDate?: string; // تاريخ الترفيع القادم
  retirementDate?: string; // تاريخ التقاعد المتوقع

  status: EmployeeStatus;
  nominalSalary: number; // الراتب الاسمي
  contractType: ContractType;
  avatar: string;
  
  // Iraqi Allowances Breakdown
  allowances: {
    certificate: number; // مخصصات شهادة
    risk: number; // مخصصات خطورة
    position: number; // مخصصات منصب
    family: number; // مخصصات زوجية وأطفال
    costOfLiving: number; // مخصصات غلاء معيشة
    transport?: number; // مخصصات نقل
    geographic?: number; // مخصصات موقع جغرافي
    engineering?: number; // مخصصات هندسية
  };
  
  documents?: RecruitmentDocument[];
  leaveBalance?: {
    regular: number; // اعتيادية
    sick: number; // مرضية
    timeOff: number; // زمنية (ساعات)
  };
}

export interface RecruitmentDocument {
  id: string;
  type: 'National ID' | 'Residence Card' | 'Degree' | 'Support Letter' | 'Other' | 'Contract' | 'Admin Order';
  name: string;
  url: string; // In real app, this is a file path
  verified: boolean;
  expiryDate?: string;
  category?: 'Personal' | 'Administrative' | 'Financial' | 'Legal';
  uploadDate?: string;
  size?: string;
}

export interface Applicant {
  id: string;
  name: string;
  nationalId: string;
  phone: string;
  email: string;
  dob: string;
  degree: string; // Bachelor, Master, PhD
  major: string;
  university: string;
  graduationYear: number;
  experienceYears: number;
  gpa: number; // المعدل
  isMartyrFamily: boolean; // ذوي الشهداء
  isPoliticalPrisoner: boolean; // السجناء السياسيين
  isDisabled: boolean; // ذوي الإعاقة
  maritalStatus: 'single' | 'married';
  childrenCount: number;
  points: number; // Calculated points
  status: ApplicantStatus;
  recruitmentType: RecruitmentType;
  governorate: string;
  appliedJobId?: string;
  documents: RecruitmentDocument[];
  interviewScore?: number;
  cvText?: string; // For AI Analysis
  notes?: string;
}

export interface JobPosting {
  id: string;
  title: string; // العنوان الوظيفي
  titleEn?: string; // English Title
  department: string;
  vacancies: number;
  type: RecruitmentType;
  status: 'Active' | 'Closed' | 'Draft';
  deadline: string;
  location: string;
  requirements: string[];
  description: string;
  postedDate: string;
  grade?: number; // الدرجة الوظيفية
  salaryScale?: string; // المدى الراتبي
}

export interface OrgUnit {
  id: string;
  name: string;
  type: 'Ministry' | 'Department' | 'Section' | 'Unit';
  manager?: string;
  authorizedStrength: number; // الملاك المصدق
  actualStrength: number; // الملاك الفعلي
  vacancies: number;
  children?: OrgUnit[];
}

export interface KPIStats {
  totalEmployees: number;
  newHires: number;
  absenceRate: number;
  productivity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: any[];
  status: 'received' | 'preparing' | 'shipping' | 'delivered';
  total: number;
  driverName?: string;
  driverLocation?: { lat: number; lng: number };
  estimatedTime?: string;
}

// --- Enterprise Accounting Interfaces ---

export interface Account {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  level: number;
  parentId?: string;
  balance: number;
  currency: 'IQD' | 'USD';
  isDebit: boolean; // Normal balance nature
  isActive: boolean;
  children?: Account[]; // For tree structure
}

export interface JournalEntryLine {
  id: string;
  accountId: string;
  accountName?: string;
  accountCode?: string;
  debit: number;
  credit: number;
  costCenter?: string;
  description?: string;
}

export interface JournalEntry {
  id: string;
  serialNumber: string;
  date: string;
  description: string;
  status: JournalStatus;
  lines: JournalEntryLine[];
  totalAmount: number;
  createdBy: string;
  referenceId?: string; // Link to Invoice, Payroll, etc.
  attachments?: string[];
}

export interface FixedAsset {
  id: string;
  name: string;
  purchaseDate: string;
  cost: number;
  usefulLifeYears: number;
  salvageValue: number;
  depreciationMethod: 'Straight Line' | 'Declining Balance';
  currentValue: number;
  location: string;
  serialNumber: string;
  status: 'Active' | 'Sold' | 'Disposed';
}

export interface Invoice {
  id: string;
  number: string;
  partyId: string; // Customer or Vendor ID
  partyName: string;
  date: string;
  dueDate: string;
  type: 'SALE' | 'PURCHASE';
  amount: number;
  paidAmount: number;
  status: InvoiceStatus;
  items: { description: string; quantity: number; unitPrice: number; total: number }[];
}

export interface BankTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'DEPOSIT' | 'WITHDRAWAL';
  status: 'MATCHED' | 'UNMATCHED';
  reference?: string;
}

// --- Administrative Orders ---

export type AdminOrderType = 'HIRING' | 'INCREMENT' | 'PROMOTION' | 'LEAVE' | 'PUNISHMENT' | 'THANKS' | 'TRANSFER' | 'RETIREMENT';

export interface AdminOrder {
  id: string;
  number: string; // رقم الأمر
  date: string;
  type: AdminOrderType;
  title: string;
  content: string; // The legal text
  employeeIds: string[];
  issuedBy: string; // Minister / DG
  status: 'DRAFT' | 'SIGNED' | 'ARCHIVED';
}

// --- NEW: Leave & Attendance ---

export type LeaveType = 'REGULAR' | 'SICK' | 'MATERNITY' | 'UNPAID' | 'OFFICIAL_MISSION' | 'EMERGENCY';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reason?: string;
  attachmentUrl?: string;
  approvedBy?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string; // 08:00
  checkOut: string; // 14:00
  status: 'PRESENT' | 'LATE' | 'ABSENT' | 'LEAVE' | 'MISSION';
  overtimeHours: number;
  deviceSource: 'Fingerprint_Main_Gate' | 'Manual_Entry';
}

// --- NEW: Payroll Details ---

export interface PayrollRecord {
  id: string;
  month: string; // 2024-10
  employeeId: string;
  employeeName: string;
  financialNumber: string;
  grade: number;
  step: number;
  
  // Earnings
  nominalSalary: number;
  allowanceCertificate: number;
  allowanceFamily: number; // Wife + Children
  allowanceRisk: number;
  allowancePosition: number;
  allowanceTransport: number;
  allowanceOther: number;
  totalEarnings: number;
  
  // Deductions
  deductionRetirement: number; // 10%
  deductionTax: number;
  deductionAbsence: number;
  deductionLoan: number;
  totalDeductions: number;
  
  netSalary: number;
  status: 'DRAFT' | 'APPROVED' | 'PAID';
}

// --- Marketplace Interface ---

export type MarketplaceCategory = 'cars' | 'food' | 'coffee' | 'supermarket' | 'pharmacy' | 'tech' | 'furniture' | 'services' | 'travel' | 'fuel' | 'jobs';

export interface MarketplaceItem {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  currency: 'USD' | 'IQD';
  category: MarketplaceCategory;
  image: string;
  rating?: number;
  location?: string;
  specs?: Record<string, string>;
  isHot?: boolean;
  vendorName?: string;
  deliveryTime?: string;
  isPromo?: boolean;
  discount?: number;
}

export interface CartItem extends MarketplaceItem {
  quantity: number;
}

export interface Vendor {
  id: string;
  name: string;
  category: MarketplaceCategory;
  rating: number;
  location: string;
  image: string;
  deliveryTime?: string;
  minOrder?: number;
}

// --- TRAINING & EXAMS ---

export interface TrainingProgram {
  id: string;
  title: string;
  code: string;
  type: 'Internal' | 'External' | 'E-Learning' | 'Workshop';
  trainer: string;
  startDate: string;
  endDate: string;
  durationHours: number;
  location: string;
  seats: number;
  enrolled: number;
  status: 'Upcoming' | 'Active' | 'Completed';
  cost: number;
  modules?: TrainingModule[];
  examId?: string;
}

export interface TrainingModule {
  id: string;
  title: string;
  type: 'Video' | 'PDF' | 'Assignment';
  durationMin: number;
  url?: string;
}

export interface Question {
  id: string;
  text: string;
  type: 'MCQ' | 'TrueFalse' | 'Text';
  options?: string[];
  correctAnswer?: string | number; // Index or Text
  marks: number;
}

export interface Exam {
  id: string;
  courseId: string;
  title: string;
  durationMin: number;
  passingScore: number;
  totalMarks: number;
  questions: Question[];
}

export interface Certificate {
  id: string;
  traineeName: string;
  courseTitle: string;
  issueDate: string;
  grade: number;
  qrCode: string;
}

// --- NEW: Workflow & Audit ---

export interface WorkflowRequest {
  id: string;
  type: 'TRANSFER' | 'PROMOTION' | 'LEAVE' | 'RESIGNATION';
  requesterId: string;
  requesterName: string;
  details: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'IN_PROGRESS';
  currentStep: number;
  totalSteps: number;
  steps: WorkflowStep[];
  date: string;
}

export interface WorkflowStep {
  id: string;
  role: string; // e.g. "Direct Manager", "HR Manager", "Finance"
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  actionDate?: string;
  approverName?: string;
  comments?: string;
}

export interface AuditLogEntry {
  id: string;
  action: string; // e.g. "USER_LOGIN", "EMPLOYEE_UPDATE", "SALARY_APPROVE"
  userId: string;
  userName: string;
  timestamp: string;
  ipAddress: string;
  details: string;
  resourceId?: string;
}

export type BulkActionType = 'INCREMENT' | 'TRANSFER' | 'PRINT_ID' | 'ARCHIVE' | 'EXPORT_SALARY';

// --- Enterprise POS & Cashier System ---

export enum POSMode {
  RETAIL = 'RETAIL',
  RESTAURANT = 'RESTAURANT',
  PHARMACY = 'PHARMACY',
  FUEL = 'FUEL'
}

export interface Shift {
  id: string;
  cashierName: string;
  startTime: string;
  endTime?: string;
  startCash: number;
  endCash?: number;
  totalSales: number;
  status: 'OPEN' | 'CLOSED';
}

export interface RestaurantTable {
  id: string;
  number: number;
  status: 'FREE' | 'OCCUPIED' | 'RESERVED' | 'BILL_PRINTED';
  capacity: number;
  currentOrderId?: string;
}

export interface POSProduct {
  id: string;
  name: string;
  barcode: string;
  price: number; // سعر المفرد
  wholesalePrice?: number; // سعر الجملة
  costPrice?: number; // سعر التكلفة
  category: string;
  image: string;
  stock: number;
  unit?: string; // قطعة، كرتون، كغم
  taxRate?: number;
  
  // Pharmacy
  batchNumber?: string;
  expiryDate?: string;
  activeIngredient?: string;
  
  // Restaurant
  isVeg?: boolean;
  prepTime?: number;
}

export interface POSCartItem extends POSProduct {
  quantity: number;
  discount?: number;
  notes?: string;
  appliedPrice: number; // The price actually used (retail or wholesale)
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  type: 'Retail' | 'Wholesale';
  loyaltyPoints: number;
  balance: number; // Credit/Debt
  creditLimit?: number; // الحد الائتماني
  address?: string;
  lastVisit?: string;
}

export interface POSTransaction {
  id: string;
  invoiceNumber: string;
  date: string;
  time: string;
  items: POSCartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  profit?: number; // Added for profit calculation
  paymentMethod: 'CASH' | 'CARD' | 'SPLIT' | 'TRANSFER' | 'CREDIT';
  status: 'COMPLETED' | 'VOID' | 'REFUNDED';
  cashierName: string;
  customerId?: string;
  tableId?: string;
}
