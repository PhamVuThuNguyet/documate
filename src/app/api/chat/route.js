// gpt-4-turbo via http API

import { OpenAIStream } from '../../utils/OpenAIStream'

if (!process.env.OPENAI_API_KEY) {
    throw new Error('Missing OpenAI API Key!')
}

export const runtime = 'edge'

export async function POST(request) {
    const { inputRequest } = await request.json()

    const system_prompt = `You are an advanced AI model with a deep understanding of software engineering principles and documentation standards across multiple programming languages. Your task is to:

    1. Identify Language: Analyze the provided code snippet to determine the programming language used.

    2. Documentation Standards: Based on the identified language, apply the appropriate documentation style (e.g., JSDoc for JavaScript, docstrings for Python, Javadoc for Java, etc.).

    3. Comprehensive Documentation: Create detailed documentation that includes:
    - Functionality: A clear explanation of what the code does.
    - Parameters: Description of any input parameters, including types and expected values.
    - Return Values: Explanation of what the function returns and its type.
    - Additional Information: Any relevant details that would be useful for a developer using or maintaining the code.
    - Inline Comments: Generate inline comments within the code snippet to explain crucial sections, including:
        + Purpose of functions and methods.
        + Important logic and algorithms.
        + Any nuances or edge cases handled by the code.
    
    4. Clarity and Professionalism: Ensure that the documentation is professional, easy to understand, and adheres to best practices for the identified programming language.

    5. Format: Return ONLY the comment documentation without any additional explanations or context.`

    const prompt = `Act as a seasoned software engineer with expertise in multiple programming languages. First, identify the programming language used in the provided code snippet. Then, analyze the code and create a comprehensive documentation using the appropriate standard format for that language. Ensure the documentation includes a clear explanation of the code's functionality, parameters, return values, and any other information that can be contained in a standard documentation. Use the following formats based on the language identified (included but not limited to): Python (docstrings), Java (Javadoc), JavaScript (JSDoc), C# (XML comments), C/C++ (Doxygen), Ruby (RDoc), or Go (comments). Provide a detailed and professional documentation that could be easily understood by other developers. Finally, pinpoint crucial points in the code and generate inline comments that clearly explain the purpose and functionality of each section. Ensure the documentation is comprehensive, clear, and adheres to best practices for the identified language. \n
    
    Given code snippet: """${inputRequest}"""
    
    Return ONLY the comment documentation without any additional or redundant details.`


    const payload = {
        model: 'gpt-4o',
        messages: [{ role: 'system', content: system_prompt }, { role: 'user', content: prompt }],
        temperature: 0.3,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 4096,
        stream: true,
        n: 1,
    }

    const stream = await OpenAIStream(payload)
    return new Response(stream)
}
