import { cookies } from "next/headers";

/**
 * APIレスポンスの基本型定義
 * すべてのAPIレスポンスの基本となる共通の型
 */
export type BaseResponse = {
	/**
	 * 操作の成功/失敗を示すステータス
	 */
	success: boolean;

	/**
	 * レスポンスに関連するメッセージ（成功時や失敗時のメッセージ）
	 */
	message?: string;

	/**
	 * エラーが発生した場合のエラーコード
	 */
	errorCode?: string;

	/**
	 * 操作が処理された時間のタイムスタンプ
	 */
	timestamp?: string;
};

export type ApiResponse<T> = {
	status: number;
	data: T;
	headers: Headers;
};

type FetchOptions = {
	method?: string;
	headers?: Record<string, string>;
	body?: BodyInit;
	cache?: RequestCache;
	next?: NextFetchOptions;
	credentials?: RequestCredentials;
};

type NextFetchOptions = {
	revalidate?: number | false;
	tags?: string[];
};

const API_BASE_URL = process.env.API_BASE_URL || "";

const getAccessToken = async () => {
	const accessToken = (await cookies()).get(
		"__Secure-better-auth.session_token",
	);
	if (accessToken) {
		return accessToken.value.split(".")[0];
	}
	return null;
};

/**
 * オプション付きのフェッチリクエスト
 * @template T レスポンスデータの型
 * @param {string} path - リクエスト先のパス
 * @param {FetchOptions} options - フェッチオプション
 * @returns {Promise<ApiResponse<T>>} API応答のPromise
 */
const fetchWithOptions = async <T>(
	path: string,
	options: FetchOptions,
): Promise<ApiResponse<T>> => {
	const url = `${API_BASE_URL}${path}`;
	const response = await fetch(url, options);
	const data = await response.json();
	return {
		status: response.status,
		data,
		headers: response.headers,
	};
};

/**
 * GETリクエスト
 * @template T レスポンスデータの型
 * @param {string} path - リクエスト先のパス
 * @param {string} [accessToken] - アクセストークン（省略可能）
 * @param {FetchOptions} [fetchOptions] - オプションのフェッチオプション
 * @returns {Promise<ApiResponse<T>>} API応答のPromise
 */
export const get = async <T>(
	path: string,
	fetchOptions?: FetchOptions,
): Promise<ApiResponse<T>> => {
	const options: FetchOptions = {
		method: "GET",
		headers: {
			Authorization: `Bearer ${await getAccessToken()}`,
		},
		...fetchOptions,
	};

	return fetchWithOptions<T>(path, options);
};

/**
 * POSTリクエスト関数
 * @template T リクエストボディの型
 * @template U レスポンスデータの型
 * @param {string} path - リクエスト先のパス
 * @param {T} [body] - リクエストボディ（オプション）
 * @param {string} [accessToken] - アクセストークン（省略可能）
 * @param {FetchOptions} [fetchOptions] - 追加のフェッチオプション（オプション）
 * @returns {Promise<ApiResponse<U>>} API応答のPromise
 */
export const post = async <T, U>(
	path: string,
	body?: T,

	fetchOptions?: FetchOptions,
): Promise<ApiResponse<U>> => {
	const options: FetchOptions = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${await getAccessToken()}`,
		},
		...(body && { body: JSON.stringify(body) }),
		...fetchOptions,
	};

	return fetchWithOptions<U>(path, options);
};

/**
 * PATCHリクエスト関数
 * @template T リクエストボディの型
 * @template U レスポンスデータの型
 * @param {string} path - リクエスト先のパス
 * @param {T} [body] - リクエストボディ（オプション）
 * @param {string} [accessToken] - アクセストークン（省略可能）
 * @param {FetchOptions} [fetchOptions] - 追加のフェッチオプション（オプション）
 * @returns {Promise<ApiResponse<U>>} API応答のPromise
 */
export const patch = async <T, U = BaseResponse>(
	path: string,
	body?: T,
	fetchOptions?: FetchOptions,
): Promise<ApiResponse<U>> => {
	const options: FetchOptions = {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${await getAccessToken()}`,
		},
		...(body && { body: JSON.stringify(body) }),
		...fetchOptions,
	};

	return fetchWithOptions<U>(path, options);
};

/**
 * DELETEリクエスト関数
 * @template T レスポンスデータの型
 * @param {string} path - リクエスト先のパス
 * @param {string} [accessToken] - アクセストークン（省略可能）
 * @param {FetchOptions} [fetchOptions] - 追加のフェッチオプション（オプション）
 * @returns {Promise<ApiResponse<T>>} API応答のPromise
 */
export const del = async <T>(
	path: string,
	fetchOptions?: FetchOptions,
): Promise<ApiResponse<T>> => {
	const options: FetchOptions = {
		method: "DELETE",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${await getAccessToken()}`,
		},
		...fetchOptions,
	};

	return fetchWithOptions<T>(path, options);
};
