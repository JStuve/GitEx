import type { PlasmoCSConfig } from 'plasmo';
import { type IssueVisited, IssueVisitedExt, LocalStorageToken, type Message, MessageType } from '../models';
import { NumberUtility } from '../utilities';

export const config: PlasmoCSConfig = {
    matches: ["https://github.com/**/**/issues", "https://github.com/**/**/issues/**"]
}

if(chrome.runtime?.onMessage) {
	chrome.runtime.onMessage.addListener(async (message: Message<unknown>, never, sendResponse) => {
		switch(message.type) {
			case MessageType.IssueLoadUI: {
				await loadIssueUI();
				break;
			}
			case MessageType.IssueVisitedCheck: {
				await setIssueVisited(message.data as string | undefined);
				break;
			}
			default: break;
		}
	});
}

async function loadIssueUI(): Promise<void> {
	const githubAuthor: string | null = await localStorage.getItem(LocalStorageToken.GitAuthor);
	const githubRepo: string | null = await localStorage.getItem(LocalStorageToken.GitRepo);
	const githubColorMode: string | null = await localStorage.getItem(LocalStorageToken.GitColorMode);

	if(githubAuthor === null || githubRepo === null) {
		console.error('[Issue Visited] Could not find author or repo')
		return;
	}

	const rawNodeElements = document.querySelectorAll('[id^="issue_"]');
	const issueElements: HTMLDivElement[] = Array.from(rawNodeElements).filter(function(element) {
		return element instanceof HTMLDivElement;
	}) as HTMLDivElement[];

	for(const issueElement of issueElements) {
		const issueId: string = issueElement.id.split('_')[1];
		const issueKey: string = IssueVisitedExt.getKey(githubAuthor, githubRepo, issueId)
		const issueVisible: {[key: string]: IssueVisited} = await chrome.storage.sync.get(issueKey);
		
		if(!issueVisible[issueKey]?.isVisited) {
			issueElement.style.backgroundColor = githubColorMode === 'light' ? 'var(--color-scale-gray-0)' : 'var(--color-scale-gray-8)';
		}
	}
}

async function setIssueVisited(url: string | undefined): Promise<void> {

	const urlParts: string[] = url?.split('/') ?? [];
	if(urlParts.length < 4) {
		// All GitHub issue urls should have 4 parts: [author]/[repo]/issues/[issueId]
		return;
	}

	if(NumberUtility.isNumber(urlParts[urlParts.length - 1]) === false) {
		// Issue was not a number
		return;
	}

	if(urlParts[urlParts.length - 2].toLocaleLowerCase() !== 'issues') {
		// 2nd to last url part was not 'issues'
		return;
	}

	const githubAuthor: string | null = await localStorage.getItem(LocalStorageToken.GitAuthor);
	const githubRepo: string | null = await localStorage.getItem(LocalStorageToken.GitRepo);

	if(githubAuthor === null || githubRepo === null) {
		console.error('[Issue Visible] Could not find author or repo')
		return;
	}

	const issueId: string = urlParts[urlParts.length - 1]
	const issueVisited: IssueVisited = { 
		id: IssueVisitedExt.getKey(githubAuthor, githubRepo, issueId), 
		isVisited: true,
		gitHub: {
			author: githubAuthor,
			repo: githubRepo,
			issue: issueId
		},
		visitedDate: new Date()
	}

	chrome.storage.sync.set({[issueVisited.id]: issueVisited});
}

loadIssueUI();
