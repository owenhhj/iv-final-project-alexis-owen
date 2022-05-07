import requests
import shutil
import csv
import os


# may use RegularExpression
def legalize_name(name: str):
    ans = ''
    for c in name:
        if c not in ['/', ' ', '.', ':', '"', "'", '|']:
            ans += c
    return ans


# https://www.kaggle.com/datasets/padhmam/qs-world-university-rankings-2017-2022
def read_urls(file_path='./public/QSWorldUniRank2017-2022.csv'):
    data_list = []
    header_passed = 0
    with open(file_path, 'r', encoding='UTF-8') as fd:
        reader = csv.reader(fd)
        for row in reader:
            if header_passed:
                name = legalize_name(row[0])
                url = row[8]
                data_list.append([name, url])
            else:
                header_passed = 1
    fd.close()
    print('read {} rows'.format(len(data_list)))
    return data_list


def main():
    data = read_urls()
    saved = {}

    for row in data:
        name, url = row[0], row[1]
        path_to_save = './saved_files_gitignored/{}.jpg'.format(name)
        if saved.get(name) or os.path.isfile(path_to_save):
            continue
        res = requests.get(url, stream=True)
        if res.status_code == 200:
            with open(path_to_save, 'wb') as fd:
                shutil.copyfileobj(res.raw, fd)
            fd.close()
            saved[name] = 1
            print('file saved, name={}'.format(name))
        else:
            print('res not ok, status_code={}'.format(res.status_code))
        del res

    return


if __name__ == '__main__':
    main()
