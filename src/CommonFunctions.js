import {useEffect, useState} from "react";
import {csv} from "d3";

export const COLORS = [
  '#7871AA',
  '#190E4F',
  '#00635D'
];

const illegalChars = ['/', ' ', '.', ':', '"', "'", '|'];

export function legalize_name(name) {
  let ans = '';
  for (let i = 0; i < name.length; i++) {
    if (!illegalChars.includes(name[i])) {
      ans += name[i];
    }
  }
  return ans;
}

export function useLocation(csvPath = './qs ranking 200 with location.csv') {
  const [dataAll, setData] = useState([]);

  useEffect(() => {
    csv(csvPath).then(data => {
      data.forEach(d => {
        d.lat = +d.lat;
        d.lng = +d.lng;
        d.ranking = +d.ranking;
        d.year = +d.year;
        d.score = +d.score;
        d.student_faculty_ratio = +d.student_faculty_ratio;
        d.international_students = +d.international_students;
        d.faculty_count = +d.faculty_count;
      });
      setData(data);
    });
  }, []);

  return dataAll;
}


