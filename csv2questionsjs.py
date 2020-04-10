import json

import pandas as pd

csv_file = 'question-value.csv'
question_js_file = 'questions.js'

question_name = '内容'
econ_name = '平等'
dipl_name = '世界'
govt_name = '自由'
scty_name = '进步'
envo_name = '生态'

if __name__ == '__main__':
    df = pd.read_csv(csv_file)
    df.fillna(0, inplace=True)
    print(df)
    questions = []
    for _, row in df.iterrows():
        if row[question_name] == 0:
            continue
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
