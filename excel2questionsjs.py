import json

import pandas as pd

csv_file = 'question-value.csv'
question_js_file = 'questions.js'

question_name = 'content'
econ_name = '经济'
dipl_name = '外事'
govt_name = '政治'
scty_name = '文化'
envo_name = '生态'

if __name__ == '__main__':
    df = pd.read_csv(csv_file)
    df.fillna(0, inplace=True)
    print(df)
    questions = []
    for _, row in df.iterrows():
        print(row)
        questions.append(
            {
                "question": row[question_name],
                "effect": {
                    "econ": row[econ_name],
                    "dipl": row[dipl_name],
                    "govt": row[govt_name],
                    "scty": row[scty_name],
                    "envo": row[envo_name],
                }
            }
        )
    with open(question_js_file, 'w') as f:
        f.write('questions=' + json.dumps(questions, ensure_ascii=False))
