import pandas as pd
import re
import json

class DataAuditor:
    def __init__(self, file_path):
        self.file_path = file_path
        self.df = None
        self.report = {
            'email_errors': [],
            'duplicates': 0,
            'anomalies': [],
            'summary': {},
            'distributions': {'domains': {}, 'companies': {}},
            'preview': {'headers': [], 'rows': []},
            'dimensions': {'validity': 100, 'uniqueness': 100, 'completeness': 100, 'consistency': 100}
        }

    def load_data(self):
        try:
            if self.file_path.endswith('.csv'):
                self.df = pd.read_csv(self.file_path, on_bad_lines='warn')
            elif self.file_path.endswith('.xlsx'):
                self.df = pd.read_excel(self.file_path)
            return self.df is not None
        except Exception as e:
            print(f"Error loading data: {e}")
            return False

    def audit_emails(self, column_name):
        if column_name not in self.df.columns:
            return
        
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        disposable_domains = ['tempmail.com', 'throwaway.com', 'mailinator.com']

        for index, email in self.df[column_name].items():
            if pd.isna(email):
                self.report['email_errors'].append({'row': index, 'error': 'Missing email'})
                continue
            
            email = str(email).strip()
            if not re.match(email_regex, email):
                self.report['email_errors'].append({'row': index, 'email': email, 'error': 'Invalid syntax'})
            elif any(domain in email for domain in disposable_domains):
                self.report['email_errors'].append({'row': index, 'email': email, 'error': 'Disposable domain'})

    def audit_duplicates(self):
        duplicates = self.df.duplicated()
        self.report['duplicates'] = int(duplicates.sum())

    def audit_anomalies(self):
        for column in self.df.columns:
            # Check for empty values in critical columns (heuristic)
            null_count = self.df[column].isnull().sum()
            if null_count > 0:
                self.report['anomalies'].append({
                    'column': column,
                    'issue': 'Missing values',
                    'count': int(null_count)
                })

    def run_audit(self):
        if not self.load_data():
            return None
        
        # Heuristic: try to find an email column
        email_cols = [c for c in self.df.columns if 'email' in c.lower()]
        if email_cols:
            self.audit_emails(email_cols[0])
        
        self.audit_duplicates()
        self.audit_anomalies()

        row_count = len(self.df)
        error_count = len(self.report['email_errors']) + self.report['duplicates'] + len(self.report['anomalies'])
        
        # Simple health score formula
        health_score = max(0, 100 - (error_count / row_count * 100 if row_count > 0 else 0))
        
        self.report['summary'] = {
            'row_count': row_count,
            'error_count': error_count,
            'health_score': round(health_score, 2)
        }
        
        return self.report

    def get_cleaned_data(self):
        if self.df is None:
            return None
        
        # Simple cleaning: deduplicate and drop rows with invalid emails (optional strategy)
        cleaned_df = self.df.drop_duplicates()
        
        # Drop rows with missing values in primary columns (heuristic)
        email_cols = [c for c in self.df.columns if 'email' in c.lower()]
        if email_cols:
            email_col = email_cols[0]
            email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
            mask = cleaned_df[email_col].apply(lambda x: bool(re.match(email_regex, str(x).strip())) if pd.notna(x) else False)
            cleaned_df = cleaned_df[mask]
            
        return cleaned_df
