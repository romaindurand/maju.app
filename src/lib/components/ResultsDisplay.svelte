<script lang="ts">
	import tinygradient from 'tinygradient';

	interface Props {
		results: {
			pollId: string;
			title: string;
			description: string | null;
			totalVotes: number;
			ranking: Array<{
				rank: number;
				name: string;
				medianGrade: number;
				medianGradeLabel: string;
				score: number;
			}>;
			grades: string[];
		};
	}

	let { results }: Props = $props();

	// Get color for grade
	function getGradeColor(gradeIndex: number): string {
		let gradient = tinygradient(['#880000', '#88FF88']);
		let tinycolors = gradient.hsv(results.grades.length, false);
		let colors = tinycolors.map((t: any) => t.toHexString());
		return colors[gradeIndex] || '#6b7280';
	}

	// Get medal emoji for top 3
	function getMedal(rank: number): string {
		if (rank === 0) return '🥇';
		if (rank === 1) return '🥈';
		if (rank === 2) return '🥉';
		return '';
	}
</script>

<div class="results-display">
	<div class="results-header">
		<h2>{results.title}</h2>
		{#if results.description}
			<p class="description">{results.description}</p>
		{/if}
		<p class="vote-count">
			{results.totalVotes} vote{results.totalVotes > 1 ? 's' : ''} enregistré{results.totalVotes > 1
				? 's'
				: ''}
		</p>
	</div>

	{#if results.totalVotes === 0}
		<div class="no-votes">
			<p>Aucun vote pour le moment.</p>
			<a href="/poll/{results.pollId}" class="btn-vote">Soyez le premier à voter !</a>
		</div>
	{:else}
		<div class="ranking">
			<h3>Classement par jugement majoritaire</h3>
				<div class="ranking-list">
					{#each results.ranking as option}
						<div class="option-result" style="--rank: {option.rank}">
						<div class="rank-badge">
								{#if option.rank <= 2}
									<span class="medal">{getMedal(option.rank)}</span>
							{:else}
									<span class="rank-number">{option.rank + 1}</span>
							{/if}
						</div>
							<div class="option-info">
								<h4>{option.name}</h4>
							<div class="median-grade">
								<span
									class="grade-badge"
										style="background-color: {getGradeColor(option.medianGrade)}"
								>
										{option.medianGradeLabel}
								</span>
								<span class="grade-label">Mention majoritaire</span>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<div class="grade-legend">
			<h4>Échelle d'évaluation</h4>
			<div class="legend-items">
				{#each results.grades as grade, index}
					<div class="legend-item">
						<span class="legend-color" style="background-color: {getGradeColor(index)}"></span>
						<span>{grade}</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}

	<div class="actions">
		<a href="/poll/{results.pollId}" class="btn-secondary">Retour au sondage</a>
		<a href="/" class="btn-secondary">Créer un nouveau sondage</a>
	</div>
</div>

<style>
	.results-display {
		max-width: 900px;
		margin: 0 auto;
	}

	.results-header {
		text-align: center;
		margin-bottom: 3rem;
	}

	h2 {
		font-size: 2.25rem;
		font-weight: 700;
		margin-bottom: 0.75rem;
		color: #1f2937;
	}

	.description {
		font-size: 1.125rem;
		color: #6b7280;
		margin-bottom: 1rem;
	}

	.vote-count {
		font-size: 1rem;
		color: #3b82f6;
		font-weight: 600;
	}

	.no-votes {
		text-align: center;
		padding: 3rem 2rem;
		background: #f9fafb;
		border-radius: 0.75rem;
		margin-bottom: 2rem;
	}

	.no-votes p {
		font-size: 1.25rem;
		color: #6b7280;
		margin-bottom: 1.5rem;
	}

	.btn-vote {
		display: inline-block;
		padding: 0.875rem 1.5rem;
		background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
		color: white;
		text-decoration: none;
		border-radius: 0.5rem;
		font-weight: 600;
		transition: all 0.2s;
	}

	.btn-vote:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
	}

	.ranking {
		margin-bottom: 3rem;
	}

	.ranking h3 {
		font-size: 1.5rem;
		font-weight: 700;
		margin-bottom: 1.5rem;
		color: #1f2937;
	}

	.ranking-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.option-result {
		display: flex;
		align-items: center;
		gap: 1.5rem;
		padding: 1.5rem;
		background: white;
		border: 2px solid #e5e7eb;
		border-radius: 0.75rem;
		transition: all 0.3s;
		animation: slideIn 0.5s ease-out calc(var(--rank) * 0.1s) both;
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateX(-20px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	.option-result:hover {
		border-color: #3b82f6;
		transform: translateX(5px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.rank-badge {
		flex-shrink: 0;
		width: 60px;
		height: 60px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
		border-radius: 50%;
		font-size: 2rem;
	}

	.option-result:nth-child(1) .rank-badge {
		background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
	}

	.option-result:nth-child(2) .rank-badge {
		background: linear-gradient(135deg, #e5e7eb 0%, #d1d5db 100%);
	}

	.option-result:nth-child(3) .rank-badge {
		background: linear-gradient(135deg, #fed7aa 0%, #fdba74 100%);
	}

	.rank-number {
		font-size: 1.5rem;
		font-weight: 700;
		color: #374151;
	}

	.option-info {
		flex: 1;
	}

	.option-info h4 {
		font-size: 1.25rem;
		font-weight: 600;
		margin-bottom: 0.5rem;
		color: #1f2937;
	}

	.median-grade {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.grade-badge {
		padding: 0.375rem 0.875rem;
		border-radius: 0.375rem;
		color: white;
		font-weight: 600;
		font-size: 0.875rem;
	}

	.grade-label {
		font-size: 0.875rem;
		color: #6b7280;
	}

	.grade-legend {
		background: #f9fafb;
		padding: 1.5rem;
		border-radius: 0.75rem;
		margin-bottom: 2rem;
	}

	.grade-legend h4 {
		font-size: 1.125rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: #1f2937;
	}

	.legend-items {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 0.75rem;
	}

	.legend-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.legend-color {
		width: 24px;
		height: 24px;
		border-radius: 0.25rem;
	}

	.actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
	}

	.btn-secondary {
		padding: 0.75rem 1.5rem;
		background: white;
		color: #3b82f6;
		text-decoration: none;
		border: 2px solid #3b82f6;
		border-radius: 0.5rem;
		font-weight: 600;
		transition: all 0.2s;
	}

	.btn-secondary:hover {
		background: #3b82f6;
		color: white;
		transform: translateY(-2px);
	}
</style>
