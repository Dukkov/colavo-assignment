import fs from 'fs/promises';

/**
 * json 문서를 파싱하는 함수입니다.
 * @param filePath - 파싱할 json 문서의 경로
 * @returns 파싱된 JSON 데이터를 제네릭 타입으로 반환합니다.
 */
export const parseJsonFile = async <T>(filePath: string): Promise<T> => {
  try {
    // 파일을 읽어와 utf-8 형식으로 data에 저장
    const data = await fs.readFile(filePath, 'utf-8');

    // 읽어온 JSON 데이터를 파싱하고 제네릭 타입으로 반환
    return JSON.parse(data) as T;
  } catch (err) {
    console.error(`Error parsing JSON file at ${filePath}:`, err);
    throw err;
  }
};
