// Hardcoded sample result. Used ONLY when the user explicitly taps
// "Try a sample notice" — never as a silent fallback for a real upload.
// This exists so the live demo survives a dead Wi-Fi connection.
//
// Deadline is a FIXED fictional date (per team decision during the feature
// freeze) rather than computed relative to "today". Every field below —
// deadline, source_excerpt, full_text — must reference the same date.
// If this date is ever changed, grep the file for it; there's no single
// source of truth left after this edit.
export const DEMO_DEADLINE_ISO = '2026-09-15'
export const DEMO_DEADLINE_DISPLAY = '15 Sep 2026'

export const DEMO_NOTICE = {
  filename: 'Re-examination_Registration_Circular.pdf',
  title: 'Re-examination Registration',
  category: 'Examination',
  urgency: 'high',
  deadline: {
    date: DEMO_DEADLINE_ISO,
    display_date: DEMO_DEADLINE_DISPLAY,
    time: '11:59 PM',
    confidence: 0.97,
    source_page: 2,
    source_excerpt:
      `All eligible candidates must complete registration and fee payment on or before ${DEMO_DEADLINE_DISPLAY}, 11:59 PM.`,
  },
  venue: {
    value: 'Department Office, Block B, Room 204',
    source_page: 1,
    source_excerpt: 'Applications must be submitted at the Department Office, Block B, Room 204.',
  },
  fee: {
    value: '₹500',
    source_page: 1,
    source_excerpt: 'A re-examination fee of Rs. 500 is applicable per subject.',
  },
  eligibility: {
    value: '2nd & 3rd year students',
    source_page: 1,
    source_excerpt: 'This circular applies to students of 2nd and 3rd year currently enrolled.',
  },
  summary:
    'Registration for re-examinations is open to eligible 2nd and 3rd year students. Complete the application and fee payment before the deadline, and submit at the department office.',
  action_items: [
    'Check eligibility for your year and subject',
    'Pay the ₹500 examination fee',
    'Submit your application at the Department Office',
  ],
  important_points: [
    { label: 'Who can apply', detail: '2nd and 3rd year students currently enrolled in the affected subjects.' },
    { label: 'What it costs', detail: 'A flat fee of ₹500 per subject, payable before submission.' },
    { label: 'Where to submit', detail: 'In person at the Department Office, Block B, Room 204.' },
  ],
  full_text: `NEHRU ARTS AND SCIENCE COLLEGE
Office of the Controller of Examinations

CIRCULAR: RE-EXAMINATION REGISTRATION — SEPTEMBER 2026

This is to inform all 2nd and 3rd year students that registration for the upcoming
re-examinations is now open. A re-examination fee of Rs. 500 is applicable per
subject. Applications must be submitted at the Department Office, Block B, Room 204,
along with proof of fee payment.

All eligible candidates must complete registration and fee payment on or before
${DEMO_DEADLINE_DISPLAY}, 11:59 PM. Applications received after this date will not be
considered under any circumstances.

For queries, contact the department office during working hours.

— Office of the Controller of Examinations`,
}

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'ml', label: 'മലയാളം' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
]

export const DEMO_TRANSLATIONS = {
  ta: 'இரண்டாம் மற்றும் மூன்றாம் ஆண்டு தகுதியுடைய மாணவர்களுக்கு மறுதேர்வு பதிவு தொடங்கியுள்ளது. கெடு நாளுக்கு முன் விண்ணப்பம் மற்றும் கட்டணத்தை முடிக்கவும், துறை அலுவலகத்தில் சமர்ப்பிக்கவும்.',
  hi: 'योग्य द्वितीय और तृतीय वर्ष के छात्रों के लिए पुनः परीक्षा पंजीकरण खुला है। समय सीमा से पहले आवेदन और शुल्क भुगतान पूरा करें और विभाग कार्यालय में जमा करें।',
  ml: 'യോഗ്യരായ രണ്ടാം, മൂന്നാം വർഷ വിദ്യാർത്ഥികൾക്ക് പുനഃപരീക്ഷാ രജിസ്ട്രേഷൻ ആരംഭിച്ചു. അവസാന തീയതിക്ക് മുൻപ് അപേക്ഷയും ഫീസും പൂർത്തിയാക്കി ഡിപ്പാർട്ട്മെന്റ് ഓഫീസിൽ സമർപ്പിക്കുക.',
  te: 'అర్హులైన 2వ, 3వ సంవత్సరం విద్యార్థులకు రీ-ఎగ్జామినేషన్ నమోదు ప్రారంభమైంది. గడువులోగా దరఖాస్తు మరియు రుసుము చెల్లింపును పూర్తి చేసి డిపార్ట్‌మెంట్ కార్యాలయంలో సమర్పించండి.',
  kn: 'ಅರ್ಹ 2ನೇ ಮತ್ತು 3ನೇ ವರ್ಷದ ವಿದ್ಯಾರ್ಥಿಗಳಿಗೆ ಮರು ಪರೀಕ್ಷಾ ನೋಂದಣಿ ತೆರೆದಿದೆ. ಗಡುವಿನೊಳಗೆ ಅರ್ಜಿ ಮತ್ತು ಶುಲ್ಕ ಪಾವತಿ ಪೂರ್ಣಗೊಳಿಸಿ ವಿಭಾಗ ಕಚೇರಿಯಲ್ಲಿ ಸಲ್ಲಿಸಿ.',
}

export const DEMO_TRANSLATED_POINTS = {
  ta: [
    { label: 'யார் விண்ணப்பிக்கலாம்', detail: 'பாதிக்கப்பட்ட பாடங்களில் தற்போது பயிலும் 2 மற்றும் 3-ஆம் ஆண்டு மாணவர்கள்.' },
    { label: 'கட்டண விவரம்', detail: 'ஒரு பாடத்திற்கு ரூ. 500 நிலையான கட்டணம், விண்ணப்பத்திற்கு முன் செலுத்த வேண்டும்.' },
    { label: 'எங்கு சமர்ப்பிக்க வேண்டும்', detail: 'துறை அலுவலகத்தில் நேரில், பிளாக் பி, அறை 204.' },
  ],
  hi: [
    { label: 'कौन आवेदन कर सकता है', detail: 'संबंधित विषयों में वर्तमान में नामांकित द्वितीय और तृतीय वर्ष के छात्र।' },
    { label: 'शुल्क', detail: 'प्रति विषय ₹500 का शुल्क, आवेदन जमा करने से पहले देय।' },
    { label: 'कहाँ जमा करें', detail: 'व्यक्तिगत रूप से विभाग कार्यालय, ब्लॉक बी, कमरा 204 में।' },
  ],
  ml: [
    { label: 'ആർക്കൊക്കെ അപേക്ഷിക്കാം', detail: 'ബാധകമായ വിഷയങ്ങളിൽ നിലവിൽ പഠിക്കുന്ന 2, 3 വർഷ വിദ്യാർത്ഥികൾക്ക്.' },
    { label: 'ഫീസ് വിവരങ്ങൾ', detail: 'ഒരു വിഷയത്തിന് ₹500 നിരക്കിൽ ഫീസ്, അപേക്ഷ നൽകുന്നതിന് മുൻപ് അടയ്ക്കണം.' },
    { label: 'എവിടെ സമർപ്പിക്കണം', detail: 'ഡിപ്പാർട്ട്മെന്റ് ഓഫീസ്, ബ്ലോക്ക് ബി, റൂം 204-ൽ നേരിട്ട്.' },
  ],
  te: [
    { label: 'ఎవరు దరఖాస్తు చేసుకోవచ్చు', detail: 'సంబంధిత సబ్జెక్టులలో ప్రస్తుతం చదువుతున్న 2వ, 3వ సంవత్సరం విద్యార్థులు.' },
    { label: 'ఫీజు వివరాలు', detail: 'ప్రతి సబ్జెక్టుకు ₹500 ఫ్లాట్ ఫీజు, సమర్పించే ముందు చెల్లించాలి.' },
    { label: 'ఎక్కడ సమర్పించాలి', detail: 'డిపార్ట్‌మెంట్ కార్యాలయంలో వ్యక్తిగతంగా, బ్లాక్ బి, రూమ్ 204.' },
  ],
  kn: [
    { label: 'ಯಾರು ಅರ್ಜಿ ಸಲ್ಲಿಸಬಹುದು', detail: 'ಸಂಬಂಧಿತ ವಿಷಯಗಳಲ್ಲಿ ಪ್ರಸ್ತುತ ದಾಖಲಾಗಿರುವ 2ನೇ ಮತ್ತು 3ನೇ ವರ್ಷದ ವಿದ್ಯಾರ್ಥಿಗಳು.' },
    { label: 'ಶುಲ್ಕದ ವಿವರ', detail: 'ಪ್ರತಿ ವಿಷಯಕ್ಕೆ ₹500 ಶುಲ್ಕ, ಸಲ್ಲಿಕೆಗೆ ಮುನ್ನ ಪಾವತಿಸಬೇಕು.' },
    { label: 'ಎಲ್ಲಿ ಸಲ್ಲಿಸಬೇಕು', detail: 'ವಿಭಾಗ ಕಚೇರಿಯಲ್ಲಿ ಖುದ್ದಾಗಿ, ಬ್ಲಾಕ್ ಬಿ, ಕೊಠಡಿ 204.' },
  ],
}

export const AUDIENCE_OPTIONS = [
  'All Students',
  'B.Sc CS',
  '2nd Year',
  '2nd Year B.Sc CS',
]

export const DEMO_STUDENT_PROFILE = {
  name: 'Arun K.',
  dept: 'B.Sc CS',
  year: '2nd Year',
}

export function matchesStudent(audience, student = DEMO_STUDENT_PROFILE) {
  if (!audience || audience === 'All Students') return true
  if (audience === student.dept) return true
  if (audience === student.year) return true
  if (audience === `${student.year} ${student.dept}`) return true
  return false
}

export const INITIAL_CIRCULARS = [
  {
    id: 'circ-1',
    audience: '2nd Year',
    title: 'Re-examination Registration',
    category: 'Examination',
    notice: DEMO_NOTICE,
    postedAt: 'Just now',
  },
  {
    id: 'circ-2',
    audience: 'All Students',
    title: 'College Canteen Guidelines & Hygiene Notice',
    category: 'General',
    postedAt: 'Yesterday',
    notice: {
      filename: 'Circular-Guidelines_New_Canteen.pdf',
      title: 'College Canteen Guidelines & Hygiene Notice',
      category: 'General',
      urgency: 'low',
      deadline: null,
      venue: {
        value: 'New College Canteen, Central Block',
        source_page: 1,
        source_excerpt: 'The new canteen commenced operations in the Central Block.',
      },
      fee: null,
      eligibility: {
        value: 'All enrolled students, faculty & staff',
        source_page: 1,
        source_excerpt: 'Guidelines apply to all students, faculty and staff members.',
      },
      summary:
        'The new college canteen has commenced operations. Outside food and beverages are strictly prohibited. Maintain cleanliness, dispose of waste in designated bins, and return utensils promptly.',
      action_items: [
        'Do not bring outside food or beverages into the canteen',
        'Dispose of food waste in the designated organic waste bins',
        'Return used plates and utensils to collection counters',
      ],
      important_points: [
        { label: 'Outside Food', detail: 'Outside food and beverages may kindly not be brought into the canteen.' },
        { label: 'Cleanliness', detail: 'Keep dining tables clean and use designated bins.' },
        { label: 'Utensils', detail: 'Utensils must remain strictly within canteen premises.' },
      ],
      full_text: `CIRCULAR: GUIDELINES FOR NEW COLLEGE CANTEEN\n\nThe new college canteen commenced operations on 02.09.2026. All students, faculty and staff are requested to follow these guidelines:\n1. Outside food and beverages may kindly not be brought into the canteen.\n2. Dispose of food waste in designated bins.\n3. Return all utensils to the counter.\n4. Avoid loud or disruptive behavior.`,
    },
  },
  {
    id: 'circ-3',
    audience: 'B.Sc CS',
    title: 'Cipher Hack 2K26 — Department Hackathon',
    category: 'Academic',
    postedAt: '2 days ago',
    notice: {
      filename: 'Cipher_Hack_2K26_Circular.pdf',
      title: 'Cipher Hack 2K26 — Department Hackathon',
      category: 'Academic',
      urgency: 'medium',
      deadline: {
        date: '2026-09-11',
        display_date: '11 Sep 2026',
        time: '05:00 PM',
        confidence: 0.95,
        source_page: 1,
        source_excerpt: 'Teams must submit project repos and final demos by September 11, 2026 at 5:00 PM.',
      },
      venue: {
        value: 'CS Department Lab 3 & Seminar Hall',
        source_page: 1,
        source_excerpt: 'The finale and judging will take place at CS Lab 3.',
      },
      fee: {
        value: 'Free / No entry fee',
        source_page: 1,
        source_excerpt: 'Participation is free for all enrolled department students.',
      },
      eligibility: {
        value: 'B.Sc Computer Science students',
        source_page: 1,
        source_excerpt: 'Open exclusively to all B.Sc CS students.',
      },
      summary:
        'Registration and final submission for Cipher Hack 2K26 is underway. Teams of 2-4 students must submit project artifacts and prepare for live jury evaluation.',
      action_items: [
        'Form a team of 2-4 members',
        'Prepare working demo repository and walkthrough document',
        'Report to Lab 3 for evaluation by 4:30 PM',
      ],
      important_points: [
        { label: 'Submission Deadline', detail: '11 September 2026 at 5:00 PM sharp.' },
        { label: 'Evaluation Venue', detail: 'CS Department Lab 3 and Seminar Hall.' },
        { label: 'Team Size', detail: '2 to 4 students per team.' },
      ],
      full_text: `DEPARTMENT OF COMPUTER SCIENCE\nCIRCULAR: CIPHER HACK 2K26\n\nAll B.Sc CS students are notified that Cipher Hack 2K26 finale is scheduled for 11 September 2026. Teams must submit by 5:00 PM.`,
    },
  },
  {
    id: 'circ-4',
    audience: '2nd Year B.Sc CS',
    title: '2nd Year Mini-Project Review Schedule',
    category: 'Academic',
    postedAt: '3 days ago',
    notice: {
      filename: 'Mini_Project_Review_Schedule.pdf',
      title: '2nd Year Mini-Project Review Schedule',
      category: 'Academic',
      urgency: 'medium',
      deadline: {
        date: '2026-09-18',
        display_date: '18 Sep 2026',
        time: '04:00 PM',
        confidence: 0.96,
        source_page: 1,
        source_excerpt: 'Phase-1 mini-project code and documentation must be submitted by 18 September 2026, 4:00 PM.',
      },
      venue: {
        value: 'Room 302, Department of Computer Science',
        source_page: 1,
        source_excerpt: 'Reviews will be conducted in Room 302.',
      },
      fee: null,
      eligibility: {
        value: '2nd Year B.Sc Computer Science students only',
        source_page: 1,
        source_excerpt: 'Mandatory for all 2nd year B.Sc CS students.',
      },
      summary:
        'Phase-1 mini-project reviews for 2nd year B.Sc CS students will begin on September 18. Submit source code and synopses to faculty guides.',
      action_items: [
        'Finalize topic synopsis with your faculty guide',
        'Push Phase-1 code to departmental repository',
        'Submit printed documentation at Room 302',
      ],
      important_points: [
        { label: 'Phase-1 Deadline', detail: '18 Sep 2026 at 04:00 PM.' },
        { label: 'Venue', detail: 'Room 302, CS Department.' },
        { label: 'Guide Approval', detail: 'Signature of faculty guide is required before review.' },
      ],
      full_text: `DEPARTMENT OF COMPUTER SCIENCE\nNOTICE: 2ND YEAR MINI-PROJECT REVIEWS\n\nAll 2nd Year B.Sc CS students must submit Phase-1 deliverables on or before 18 September 2026, 4:00 PM at Room 302.`,
    },
  },
]
