import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface GeneratedAnswerProps {
  answer: string;
}

const GeneratedAnswer = ({ answer }: GeneratedAnswerProps) => (
  <Card>
    <CardHeader>
      <CardTitle>Generated Answer</CardTitle>
    </CardHeader>
    <CardContent>
      <p>{answer}</p>
    </CardContent>
  </Card>
);


export default GeneratedAnswer