<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProjectStatus extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_name_id', 'status', 'sequence'
    ];

    public function projectName(){
        return $this->belongsTo(ProjectName::class, 'project_name_id',);
    }

    public function projectDetail(){
        return $this->hasMany(ProjectDetail::class, 'project_status_id', 'id');
    }
}
