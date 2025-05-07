import React from 'react'
import PersonalDetailPreview from './preview/PersonalDetailPreview';
import { useContext } from 'react';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import SummeryPreview from './preview/SummeryPreview';
import ExperiencePreview from './preview/ExperiencePreview';
import EducationalPreview from './preview/EducationalPreview';
import SkillsPreview from './preview/SkillsPreview';

function ResumePreview() {
    const { resumeInfo,setResumeInfo} = useContext(ResumeInfoContext);
  return (
    <div className='shadow-lg h-full p-14 border-t-[20px]'
    style={{borderTopColor: resumeInfo?.themeColor}}
    >
        <PersonalDetailPreview resumeInfo={resumeInfo}/>
        <SummeryPreview resumeInfo={resumeInfo}/>
        <ExperiencePreview resumeInfo={resumeInfo} />
        <EducationalPreview resumeInfo={resumeInfo} />
        <SkillsPreview resumeInfo={resumeInfo} />

      
    </div>
  )
}

export default ResumePreview
