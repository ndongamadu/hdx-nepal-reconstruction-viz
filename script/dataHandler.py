#add pcodes to the survey file

""" the files should be located in the data folder and named like :
- the survey file : survey.xlsx
- the file with codes : pcodes.csv

the script merge the pcodes data to the survey file when the district names matches"""

import pandas as pd

surveyData = pd.read_excel('data/survey.xlsx')
df = pd.read_csv('data/pcodes2.csv')

pcodedData = surveyData.merge(df, left_on='District', right_on='HRRP_DNAME')

columnSelection = [
                    'District',
                    'VDC/Municipality', 
                    'Urban/Rural', 
                    'Age', 'Gender',  
                    'Marital Status',  
                    'Caste/ethnicity',
                    'Occupation',
                    'What is the current status of your home?',
                    '1. Are your main reconstruction needs being addressed?',
                    '2. Do you have the information you need to access housing reconstruction support?',
                    '3. Have you consulted an engineer for your housing reconstruction needs?',
                    '5. Have you received any housing reconstruction support (this includes both financial and technical)?',
                    '6. Have you been able to commit your own resources?',
                    '7.  Are you aware how to build by using safer housing practices?',
                    '8. Do you face any barriers to receive support to reconstruct your house?',
                    '10. Are you satisfied with grant dispersal process?',
                    '11. Besides building your home, what is the biggest community reconstruction need of your community?',
                    '12. Are your family’s daily food need being met?',
                    '13. What is your primary source of income generation now?',
                    '14. How much of your own food do you grow?',
                    '15. Has damage from the earthquake impacted your livelihood?',
                    '16. Do you face any constraints to livelihood recovery?',
                    '17. What one skill would you like to develop in support of your livelihood?',
                    '18. Do you feel that your source of livelihood would survive another disaster?',
                    '19. Have any members of your family been required to migrate to support your family’s recovery?',
                    'HRRP_DNAME',
                    'HRRP_DCODE'
                    ]

data = pcodedData[columnSelection]

#write clean data
data.to_csv('data/cleanData2.csv')