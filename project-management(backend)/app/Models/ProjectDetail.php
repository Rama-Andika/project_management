<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProjectDetail extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id', 'project_name_id', 'sequence', 'project_status', 'document_attch', 'project_note'
    ];

    // public function projects(){
    //     return $this->hasMany(Project::class,'project_id','id');
    // }

    // public function projectNames(){
    //     return $this->hasMany(ProjectName::class,'project_name_id','id');
    // }

    public function project(){
        return $this->belongsTo(Project::class,'project_id','id');
    }
    public function projectName(){
        return $this->belongsTo(ProjectName::class,'project_name_id','id');
    }

    public function getDocumentAttchAttribute($document_attch){
        return asset('storage/document/' . $document_attch);
    }
}
