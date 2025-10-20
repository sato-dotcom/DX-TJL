import React from 'react';
import { exportToCsv } from '../utils/exportUtils.js';

export const ShainView = ({ shainList, onAddShain, onEditShain, onDeleteShain }) => {

    const handleExport = () => {
        if (shainList.length === 0) {
            alert("エクスポートするデータがありません。");
            return;
        }
        // Dynamically get headers from the first object, excluding 'id'
        const headers = Object.keys(shainList[0]).filter(key => key !== 'id');
        const rows = shainList.map(shain => headers.map(header => shain[header]));
        exportToCsv('社員名簿.csv', headers, rows);
    };

    return (
        <div className="max-w-full mx-auto bg-white rounded-b-lg shadow-lg p-6">
            <div className="flex justify-end items-center mb-6">
                <button 
                    onClick={onAddShain} 
                    className="px-4 py-2 mr-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm"
                >
                    新規社員追加
                </button>
                <button 
                    onClick={handleExport} 
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    CSVエクスポート
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                   <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                            <th className="p-3 text-left text-sm font-semibold text-gray-600 border-b">社員番号</th>
                            <th className="p-3 text-left text-sm font-semibold text-gray-600 border-b">氏名</th>
                            <th className="p-3 text-left text-sm font-semibold text-gray-600 border-b">事業所</th>
                            <th className="p-3 text-left text-sm font-semibold text-gray-600 border-b">部署</th>
                            <th className="p-3 text-left text-sm font-semibold text-gray-600 border-b">メールアドレス</th>
                            <th className="p-3 text-left text-sm font-semibold text-gray-600 border-b">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shainList.map(shain => (
                            <tr key={shain.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 text-sm text-gray-700">{shain.社員番号}</td>
                                <td className="p-3 text-sm text-gray-700">{`${shain.姓} ${shain.名}`}</td>
                                <td className="p-3 text-sm text-gray-700">{shain.事業所}</td>
                                <td className="p-3 text-sm text-gray-700">{shain.部署}</td>
                                <td className="p-3 text-sm text-gray-700">{shain.メールアドレス}</td>
                                <td className="p-3 text-sm text-gray-700">
                                    <button onClick={() => onEditShain(shain)} className="text-blue-600 hover:text-blue-800 mr-2">編集</button>
                                    <button onClick={() => onDeleteShain(shain.id)} className="text-red-600 hover:text-red-800">削除</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
