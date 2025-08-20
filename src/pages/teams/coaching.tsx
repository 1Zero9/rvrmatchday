import Link from 'next/link';
import { motion } from 'framer-motion';
import StandardLayout from '@/components/StandardLayout';

export default function CoachingStaff() {
  const coachingStaff = [
    {
      id: 'head-coach',
      name: 'Michael O\'Sullivan',
      position: 'Head Coach & First Team Manager',
      qualifications: ['UEFA A License', 'FAI Coaching Badge', 'Sports Psychology Cert'],
      experience: '15 years coaching experience',
      specialization: 'Tactical Analysis & Player Development',
      teams: ['First Team'],
      yearsAtClub: 8,
      previousExperience: 'Former professional player with Cork City FC, UEFA coaching education',
      philosophy: 'Focus on possession-based football with emphasis on technical skills and team cohesion',
      image: null,
      email: 'michael@rvrafc.com'
    },
    {
      id: 'youth-director',
      name: 'Sarah Mitchell',
      position: 'Youth Development Director',
      qualifications: ['UEFA B License', 'Youth Development Specialist', 'Child Protection Officer'],
      experience: '12 years youth coaching',
      specialization: 'Youth Development & Academy Programs',
      teams: ['U16 Rangers', 'Academy Program'],
      yearsAtClub: 6,
      previousExperience: 'Provincial youth coaching, former Ireland U19 assistant coach',
      philosophy: 'Player-centered development with focus on individual growth and enjoyment',
      image: null,
      email: 'sarah@rvrafc.com'
    },
    {
      id: 'reserves-coach',
      name: 'Tommy Walsh',
      position: 'Reserve Team Manager',
      qualifications: ['FAI Coaching Badge', 'Sports Science Degree'],
      experience: '10 years coaching experience',
      specialization: 'Fitness & Conditioning',
      teams: ['Reserve Team'],
      yearsAtClub: 5,
      previousExperience: 'Semi-professional player, fitness instructor qualification',
      philosophy: 'High-intensity training with emphasis on physical preparation and mental resilience',
      image: null,
      email: 'tommy@rvrafc.com'
    },
    {
      id: 'youth-coach-1',
      name: 'Mark O\'Connor',
      position: 'U14 Manager',
      qualifications: ['FAI Coaching Badge', 'Safeguarding Children Certificate'],
      experience: '8 years youth coaching',
      specialization: 'Technical Skills Development',
      teams: ['U14 Rangers'],
      yearsAtClub: 4,
      previousExperience: 'Primary school teacher, club volunteer for 10 years',
      philosophy: 'Technical skill development through fun, engaging training sessions',
      image: null,
      email: 'mark@rvrafc.com'
    },
    {
      id: 'youth-coach-2',
      name: 'Emma Walsh',
      position: 'U12 Manager',
      qualifications: ['Grassroots Coaching Certificate', 'First Aid Certified'],
      experience: '6 years grassroots coaching',
      specialization: 'Grassroots Development',
      teams: ['U12 Rangers'],
      yearsAtClub: 3,
      previousExperience: 'Parent volunteer, completed coaching development pathway',
      philosophy: 'Equal playing time and positive reinforcement for all players',
      image: null,
      email: 'emma@rvrafc.com'
    },
    {
      id: 'youth-coach-3',
      name: 'James Kelly',
      position: 'U10 Manager',
      qualifications: ['Introduction to Coaching Certificate', 'Child Welfare Officer'],
      experience: '5 years mini football coaching',
      specialization: 'Fun-based Learning',
      teams: ['U10 Rangers'],
      yearsAtClub: 2,
      previousExperience: 'Parent volunteer, recreational football player',
      philosophy: 'Fun-first approach with focus on basic skills and teamwork',
      image: null,
      email: 'james@rvrafc.com'
    },
    {
      id: 'veterans-coach',
      name: 'John Fitzgerald',
      position: 'Veterans Manager',
      qualifications: ['FAI Coaching Badge', '25+ years playing experience'],
      experience: '20 years coaching experience',
      specialization: 'Veteran Player Management',
      teams: ['Veterans Team'],
      yearsAtClub: 10,
      previousExperience: 'Former club player, managed several local teams',
      philosophy: 'Competitive football with respect for veteran players\' experience and limitations',
      image: null,
      email: 'john@rvrafc.com'
    },
    {
      id: 'goalkeeper-coach',
      name: 'David Ryan',
      position: 'Goalkeeper Coach',
      qualifications: ['Goalkeeper Coaching Specialist', 'Sports Psychology'],
      experience: '10 years goalkeeper coaching',
      specialization: 'Goalkeeper Development',
      teams: ['All Senior Teams', 'U16+'],
      yearsAtClub: 4,
      previousExperience: 'Former semi-professional goalkeeper, specialized coaching education',
      philosophy: 'Technical excellence combined with mental strength and decision-making',
      image: null,
      email: 'david@rvrafc.com'
    }
  ];

  const departments = [
    {
      name: 'First Team',
      staff: ['Michael O\'Sullivan', 'Patrick Ryan (Assistant)', 'David Ryan (GK Coach)'],
      focus: 'Competitive senior football and player recruitment'
    },
    {
      name: 'Youth Development',
      staff: ['Sarah Mitchell (Director)', 'Mark O\'Connor', 'Emma Walsh', 'James Kelly'],
      focus: 'Player development from grassroots to senior level'
    },
    {
      name: 'Reserve & Veterans',
      staff: ['Tommy Walsh', 'John Fitzgerald', 'Kevin Murphy (Assistant)'],
      focus: 'Development pathway and veteran player engagement'
    }
  ];

  return (
    <StandardLayout title="Coaching Staff">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/about" className="hover:text-blue-600 transition-colors">
              About Us
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Coaching Staff</span>
          </div>
        </nav>

        {/* Teams Section Navigation */}
        <div className="mb-12">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Our Teams</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/teams/youth" className="group">
                <div className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 border-l-4 border-gray-300 hover:border-gray-500 transition-all duration-200">
                  <h3 className="font-medium text-gray-900 mb-2 group-hover:text-gray-700">Youth Teams</h3>
                  <p className="text-sm text-gray-600">Ages 7-18, development focused</p>
                </div>
              </Link>
              
              <Link href="/teams/senior" className="group">
                <div className="bg-gray-50 hover:bg-gray-100 rounded-lg p-4 border-l-4 border-gray-300 hover:border-gray-500 transition-all duration-200">
                  <h3 className="font-medium text-gray-900 mb-2 group-hover:text-gray-700">Senior Teams</h3>
                  <p className="text-sm text-gray-600">Adult competitive football</p>
                </div>
              </Link>
              
              <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                <h3 className="font-medium text-purple-900 mb-2">Coaching Staff</h3>
                <p className="text-sm text-purple-700">Meet our qualified coaches</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-lg shadow-lg border border-gray-200 p-8"
            >
              <div className="flex items-center mb-6">
                <div className="bg-purple-100 rounded-full p-3 mr-4">
                  <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Our Coaching Team</h2>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed mb-6">
                  Rivervalley Rangers AFC is proud to have a team of qualified, dedicated coaches who bring a wealth of experience and expertise to our club. Our coaching staff spans all levels from grassroots mini-football to senior competitive teams, ensuring quality development opportunities for every player.
                </p>
                
                <div className="grid md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-purple-600 mb-1">25+</div>
                    <div className="text-sm text-purple-800">Qualified Coaches</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">180+</div>
                    <div className="text-sm text-blue-800">Years Experience</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">15</div>
                    <div className="text-sm text-green-800">UEFA/FAI Certified</div>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-amber-600 mb-1">8</div>
                    <div className="text-sm text-amber-800">Teams Managed</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Department Structure */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg border border-gray-200 p-8"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Coaching Departments</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {departments.map((dept, index) => (
                  <div key={dept.name} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">{dept.name}</h4>
                    <div className="space-y-2 mb-3">
                      {dept.staff.map((staff, idx) => (
                        <div key={idx} className="text-sm text-gray-600">{staff}</div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500">{dept.focus}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Coaching Staff Profiles */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900">Meet Our Coaches</h3>
              {coachingStaff.map((coach, index) => (
                <motion.div
                  key={coach.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * (index + 1) }}
                  className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    
                    {/* Coach Photo Placeholder */}
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Coach Details */}
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 mb-1">{coach.name}</h4>
                          <p className="text-purple-600 font-medium mb-2">{coach.position}</p>
                          <p className="text-gray-600 text-sm mb-2">{coach.experience} | {coach.yearsAtClub} years at club</p>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h5 className="font-semibold text-gray-700 text-sm mb-2">Qualifications</h5>
                          <div className="space-y-1">
                            {coach.qualifications.map((qual, idx) => (
                              <span key={idx} className="block text-sm text-gray-600">• {qual}</span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h5 className="font-semibold text-gray-700 text-sm mb-2">Teams Managed</h5>
                          <div className="space-y-1">
                            {coach.teams.map((team, idx) => (
                              <span key={idx} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-1 mb-1">
                                {team}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h5 className="font-semibold text-gray-700 text-sm mb-1">Specialization</h5>
                        <p className="text-gray-600 text-sm">{coach.specialization}</p>
                      </div>
                      
                      <div className="mb-4">
                        <h5 className="font-semibold text-gray-700 text-sm mb-1">Background</h5>
                        <p className="text-gray-600 text-sm">{coach.previousExperience}</p>
                      </div>
                      
                      <div className="mb-4">
                        <h5 className="font-semibold text-gray-700 text-sm mb-1">Coaching Philosophy</h5>
                        <p className="text-gray-600 text-sm italic">"{coach.philosophy}"</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          Contact: {coach.email}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Become a Coach */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-purple-50 rounded-lg border border-purple-200 p-6"
            >
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253z" />
                </svg>
                <h3 className="text-lg font-semibold text-purple-900">Join Our Coaching Team</h3>
              </div>
              <p className="text-purple-700 text-sm leading-relaxed mb-4">
                We're always looking for passionate individuals to join our coaching staff. We provide training and support for new coaches.
              </p>
              <div className="space-y-2">
                <Link href="/get-involved/coaching" className="block bg-purple-600 text-white text-center py-2 px-4 rounded text-sm font-medium hover:bg-purple-700 transition-colors">
                  Become a Coach
                </Link>
                <Link href="/get-involved/volunteering" className="block bg-white text-purple-600 text-center py-2 px-4 rounded border border-purple-600 text-sm font-medium hover:bg-purple-50 transition-colors">
                  Volunteer Opportunities
                </Link>
              </div>
            </motion.div>

            {/* Coach Development */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-lg shadow-lg border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Coach Development</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Ongoing Education</h4>
                  <p className="text-gray-600">All coaches participate in regular training and development programs</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Qualification Support</h4>
                  <p className="text-gray-600">Club supports coaches pursuing advanced qualifications</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Mentorship Program</h4>
                  <p className="text-gray-600">New coaches paired with experienced mentors</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Resource Library</h4>
                  <p className="text-gray-600">Access to coaching materials and training resources</p>
                </div>
              </div>
            </motion.div>

            {/* Coaching Philosophy */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-green-50 rounded-lg border border-green-200 p-6"
            >
              <div className="flex items-center mb-4">
                <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h3 className="text-lg font-semibold text-green-900">Club Philosophy</h3>
              </div>
              <div className="space-y-3 text-sm text-green-800">
                <div className="flex items-start space-x-2">
                  <div className="bg-green-200 rounded-full p-1 mt-0.5 flex-shrink-0">
                    <svg className="w-2 h-2 text-green-600" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3"/>
                    </svg>
                  </div>
                  <span>Player development over results at youth level</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="bg-green-200 rounded-full p-1 mt-0.5 flex-shrink-0">
                    <svg className="w-2 h-2 text-green-600" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3"/>
                    </svg>
                  </div>
                  <span>Positive reinforcement and supportive environment</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="bg-green-200 rounded-full p-1 mt-0.5 flex-shrink-0">
                    <svg className="w-2 h-2 text-green-600" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3"/>
                    </svg>
                  </div>
                  <span>Technical skill development and football intelligence</span>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="bg-green-200 rounded-full p-1 mt-0.5 flex-shrink-0">
                    <svg className="w-2 h-2 text-green-600" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3"/>
                    </svg>
                  </div>
                  <span>Respect, discipline and sportsmanship</span>
                </div>
              </div>
            </motion.div>

            {/* Navigation Links */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              className="bg-gray-50 rounded-lg border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Pages</h3>
              <div className="space-y-2">
                <Link href="/teams/youth" className="block text-blue-600 hover:text-blue-800 transition-colors text-sm">
                  → Youth Teams
                </Link>
                <Link href="/teams/senior" className="block text-blue-600 hover:text-blue-800 transition-colors text-sm">
                  → Senior Teams
                </Link>
                <Link href="/get-involved/coaching" className="block text-gray-600 hover:text-gray-800 transition-colors text-sm">
                  → Become a Coach
                </Link>
                <Link href="/join/youth" className="block text-gray-600 hover:text-gray-800 transition-colors text-sm">
                  → Player Registration
                </Link>
                <Link href="/about" className="block text-gray-600 hover:text-gray-800 transition-colors text-sm">
                  → About Our Club
                </Link>
              </div>
            </motion.div>

          </div>
        </div>

      </div>
    </StandardLayout>
  );
}