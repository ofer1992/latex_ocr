from dotenv import load_dotenv; load_dotenv('.env')
import base64
import llm

system_prompt = """
Extract the equation from the image in valid latex without any delimiters.
Do not include any other text besides the extracted formula.

Examples:
"y = mx + b"
"x^2 + y^2 = r^2"
"\int_{0}^{1} x^2 dx"
"""
def process_image_to_latex(b64image):
    bimage = base64.b64decode(b64image)
    model = llm.get_model("claude-3.5-sonnet")
    res = model.prompt("Extract the formula",
                       system=system_prompt,
                    attachments=[llm.Attachment(content=bimage)])
    reply = res.text()
    return reply

# with open("examples/1.png", 'rb') as f:
    # bimage = f.read()
    # print(ocr(bimage))