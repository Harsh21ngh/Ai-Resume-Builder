import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React, { useContext, useEffect, useState } from 'react';
import RichTextEditor from '../RichTextEditor';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { useParams } from 'react-router-dom';
import GlobalApi from './../../../../../service/GlobalApi';
import { toast } from 'sonner';
import { LoaderCircle } from 'lucide-react';

function Experience() {
    const [experinceList, setExperinceList] = useState([]);
    const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
    const params = useParams();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch resume info from Strapi if not in context
        if (!resumeInfo?.id && params?.resumeId) {
            GlobalApi.getResumeById(params.resumeId)
                .then((res) => {
                    const data = res?.data;
                    if (data) {
                        setResumeInfo(data);
                        if (Array.isArray(data.experience)) {
                            setExperinceList(data.experience);
                        }
                    }
                })
                .catch(() => {
                    toast('Failed to load resume data');
                });
        } else if (Array.isArray(resumeInfo?.experience)) {
            setExperinceList(resumeInfo.experience);
        }
    }, []);

    const handleChange = (index, event) => {
        const newEntries = [...experinceList];
        const { name, value } = event.target;
        newEntries[index][name] = value;
        setExperinceList(newEntries);
    };

    const AddNewExperience = () => {
        setExperinceList((prev) => [
            ...prev,
            {
                title: '',
                companyName: '',
                city: '',
                state: '',
                startDate: '',
                endDate: '',
                workSummery: '',
            },
        ]);
    };

    const RemoveExperience = () => {
        setExperinceList((prev) => prev.slice(0, -1));
    };

    const handleRichTextEditor = (e, name, index) => {
        const newEntries = [...experinceList];
        newEntries[index][name] = e.target.value;
        setExperinceList(newEntries);
    };

    const handleAIResponse = (aiResponse, index) => {
        const points = aiResponse.resume_points;
        if (Array.isArray(points)) {
            const formattedPoints = points.map(pt => `${pt}`).join('\n');
            const newEntries = [...experinceList];
            newEntries[index]['workSummery'] = formattedPoints;
            setExperinceList(newEntries);
        } else {
            toast('Invalid AI response.');
        }
    };

    useEffect(() => {
        setResumeInfo({
            ...resumeInfo,
            experience: experinceList,
        });
    }, [experinceList]);

    const onSave = () => {
        setLoading(true);
        const data = {
            data: {
                experience: experinceList.map(({ id, ...rest }) => rest),
            },
        };

        GlobalApi.UpdateResumeDetail(params?.resumeId, data)
            .then(() => {
                setLoading(false);
                toast('Details updated!');
            })
            .catch(() => {
                setLoading(false);
                toast('Failed to update. Please try again.');
            });
    };

    return (
        <div>
            <div className="p-5 shadow-lg rounded-lg border-t-purple-500 border-t-4 mt-10">
                <h2 className="font-bold text-lg">Professional Experience</h2>
                <p>Add your previous job experience.</p>
                <div>
                    {experinceList.map((item, index) => (
                        <div key={index}>
                            <div className="grid grid-cols-2 gap-3 border p-3 my-5 rounded-lg">
                                <div>
                                    <label className="text-xs">Position Title</label>
                                    <Input
                                        name="title"
                                        onChange={(event) => handleChange(index, event)}
                                        value={item?.title}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs">Company Name</label>
                                    <Input
                                        name="companyName"
                                        onChange={(event) => handleChange(index, event)}
                                        value={item?.companyName}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs">City</label>
                                    <Input
                                        name="city"
                                        onChange={(event) => handleChange(index, event)}
                                        value={item?.city}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs">State</label>
                                    <Input
                                        name="state"
                                        onChange={(event) => handleChange(index, event)}
                                        value={item?.state}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs">Start Date</label>
                                    <Input
                                        type="date"
                                        name="startDate"
                                        onChange={(event) => handleChange(index, event)}
                                        value={item?.startDate}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs">End Date</label>
                                    <Input
                                        type="date"
                                        name="endDate"
                                        onChange={(event) => handleChange(index, event)}
                                        value={item?.endDate}
                                    />
                                </div>
                                <div className="col-span-2">
                                    <RichTextEditor
                                        index={index}
                                        positionTitle={item?.title}
                                        defaultValue={item?.workSummery}
                                        onRichTextEditorChange={(event) =>
                                            handleRichTextEditor(event, 'workSummery', index)
                                        }
                                        onAIGenerate={(aiResponse) =>
                                            handleAIResponse(aiResponse, index)
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between">
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={AddNewExperience} className="text-purple-500">
                            + Add More Experience
                        </Button>
                        <Button variant="outline" onClick={RemoveExperience} className="text-purple-500">
                            - Remove
                        </Button>
                    </div>
                    <Button className="bg-purple-500" disabled={loading} onClick={onSave}>
                        {loading ? <LoaderCircle className="animate-spin" /> : 'Save'}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Experience;
