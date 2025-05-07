import { Button } from '@/components/ui/button';
import { Brain, LoaderCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
    BtnBold,
    BtnBulletList,
    BtnItalic,
    BtnLink,
    BtnNumberedList,
    BtnStrikeThrough,
    BtnUnderline,
    Editor,
    EditorProvider,
    Separator,
    Toolbar,
} from 'react-simple-wysiwyg';
import { AIChatSession } from './../../../../service/AIModal';
import { toast } from 'sonner';

const PROMPT_TEMPLATE =
    'Position title: {positionTitle}. Based on this, provide 5-7 concise bullet points for my resume experience (avoid mentioning experience level). Format the output using valid HTML list tags.';

function RichTextEditor({ onRichTextEditorChange, index, defaultValue, positionTitle }) {
    const [value, setValue] = useState(defaultValue);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setValue(defaultValue);
    }, [defaultValue]);

    const generateSummaryFromAI = async () => {
        setLoading(true);
        if (!positionTitle?.trim()) {
            toast.error('Please enter a Position Title before generating content.');
            return;
        }

        const prompt = PROMPT_TEMPLATE.replace('{positionTitle}', positionTitle);

        try {
            const result = await AIChatSession.sendMessage(prompt);
            const textResponse =result.response.text();

            const cleanedHtml = textResponse.replace(/^[\[\]]/g, '').trim();
            setValue(textResponse.replace('[','').replace(']',''));

            onRichTextEditorChange({
                target: { value: cleanedHtml },
            });
        } catch (error) {
            console.error('AI generation error:', error);
            toast.error('Failed to generate content. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between my-2">
                <label className="text-xs font-medium">Summary</label>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={generateSummaryFromAI}
                    disabled={loading}
                    className="flex items-center gap-2 border-purple-500 text-purple-500"
                >
                    {loading ? (
                        <LoaderCircle className="animate-spin h-4 w-4" />
                    ) : (
                        <>
                            <Brain className="h-4 w-4" /> Generate with AI
                        </>
                    )}
                </Button>
            </div>
            <EditorProvider>
                <Editor
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                        onRichTextEditorChange(e);
                    }}
                    placeholder="Write your job summary here..."
                >
                    <Toolbar>
                        <BtnBold />
                        <BtnItalic />
                        <BtnUnderline />
                        <BtnStrikeThrough />
                        <Separator />
                        <BtnNumberedList />
                        <BtnBulletList />
                        <Separator />
                        <BtnLink />
                    </Toolbar>
                </Editor>
            </EditorProvider>
        </div>
    );
}

export default RichTextEditor;
