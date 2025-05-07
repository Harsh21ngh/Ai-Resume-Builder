import React, { useState } from 'react'
import { Loader2, PlusSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import GlobalApi from './../../../service/GlobalApi';
 
function AddResume() {
    const [openDialog, setOpenDialog] = useState(false)
    const [resumeTitle, setResumeTitle] = useState();
    const { user } =useUser();
    const [loading,setLoading]=useState(false);
    const navigation=useNavigate();


    const onCreate=async()=>{ 
        setLoading(true);      
        const uuid=uuidv4();
        const data={
            data:{
                title:resumeTitle,
                resumeId:uuid,
                userEmail:user?.primaryEmailAddress?.emailAddress,
                userName:user?.fullName
            }
        }            
        GlobalApi.CreateNewResume(data).then(resp=>{
            console.log(resp.data.data.documentId);
            if(resp){
                setLoading(false);
                navigation('/dashboard/resume/'+resp.data.data.documentId+"/edit");
            }
        },(error)=>{
            setLoading(false);
        })
    }

    return (
        <div>
            <div
                className='p-14 py-24 border items-center flex justify-center bg-secondary rounded-lg h-[280px]
                hover:scale-105 transition-all hover:shadow-lg cursor-pointer border-dashed border-gray-400'
                onClick={() => setOpenDialog(true)}
            >
                <PlusSquare />
            </div>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Resume</DialogTitle>
                        <DialogDescription>
                            <p>Add a title for your new Resume</p>
                            <Input className='mt-2' placeholder="Ex.Harsh Resume-1"
                            onChange={(e)=>setResumeTitle(e.target.value)}
                            />
                        </DialogDescription>
                        <div className='flex gap-5 mt-3 justify-end'>
                        <Button onClick={()=>setOpenDialog(false)} variant="ghost" className='hover:bg-red-700 hover:text-white'>Cancle</Button>
                            <Button 
                            disabled={!resumeTitle || loading}
                            onClick={()=> onCreate()}>
                                {loading ? <Loader2 className='animate-spin'/> : "Create"}
                            </Button>
                            
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AddResume
